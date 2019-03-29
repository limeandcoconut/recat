import {rpopAsync, lrangeAsync, rpushAsync} from '../models/redis'
import fs from 'fs'
import chalk from 'chalk'
import paths from '.././../../config/paths'
import logger from '../../shared/logging/logger'
import webp from 'webp-converter'
import path from 'path'
import url from 'url'
import http from 'http'
import https from 'https'
import filenamify from 'filenamify'
import {createBrotliCompress} from 'zlib'

/* eslint-disable require-jsdoc */

// TODO: Consider moving this magic number to a config somplace. Doesn't seem right for config/env.js 🤷‍♀️
const requiredImags = 5
// TODO: Maybe config for this
const apiUrl = 'http://aws.random.cat/meow'

const isHttps = (url) => /^https/.test(url)
const chooseProtocol = (url) => isHttps(url) ? https : http
const apiProtocol = chooseProtocol(apiUrl)

const WEBP_EXTENSION = '.webp'
const BROTLI_EXTENSION = '.br'

const brotliDirLength = paths.brotliImages.length
export const swapForWebp = (brotliPath) => paths.webpImages + brotliPath.slice(brotliDirLength, -3)

function getImagesQueueFromDisk() {
    const images = fs.readdirSync(paths.brotliImages, {encoding: 'utf8'})

    if (!images || images.length < requiredImags) {
        throw new Error(`Not enough images in ${paths.brotliImages}. Please seed with at least ${requiredImags} images.`)
    }

    const imagesCount = images.length

    const queue = new Array(requiredImags).fill().map(() => {
        const randomIndex = Math.floor(Math.random() * imagesCount)
        return path.join(paths.brotliImages, images[randomIndex])
    })

    return queue

}

async function getImagesQueue(userId) {
    let images = await lrangeAsync(userId, 0, -1)

    if (images && images.length) {
        logger.debug(`fetched images from redis for: ${userId}`)
        return images
    }

    images = getImagesQueueFromDisk()
    logger.debug(`fetched images from disk for: ${userId}`)
    // TODO: Any reason to await this?
    rpushAsync(userId, ...images)
    return images
}

export async function getOne(userId) {
    // Start the async process to get a new image
    requestNewImageFromAPI(userId)

    // Get images a to show
    const images = await getImagesQueue(userId)

    // Redis has atomicity and concurrency but not parallelism so this shouldn't be an issue
    rpopAsync(userId)

    // Pop the next one from memory and return it
    // This will always be brotli compressed, we're optimistic 😄
    return images.pop()
}

// TODO: consider resizing images
async function requestNewImageFromAPI(userId) {
    // Attempt to get an image url. If we don't just quit.
    // Lets assume that they're using some super secret special sauce that justifies not choosing local files
    // randomly every time. Supposed to use the endpoint right? Cool, this sounds like an absurdly fun, contrived flow.
    let imageUrl
    try {
        imageUrl = await getUrlFromAPI()
    } catch (error) {
        logger.warn('Url fetch failed.', error)
        return false
    }

    // Got a URL
    // Sanitize filename for all filesystems
    const pathname = url.parse(imageUrl).pathname
    const rawName = filenamify(pathname)

    // Generate webp filename.
    const parsedRawName = path.parse(rawName)
    const webpName = parsedRawName.name + WEBP_EXTENSION
    const webpPath = path.join(paths.webpImages, webpName)
    const brolitName = webpName + BROTLI_EXTENSION
    const brotliPath = path.join(paths.brotliImages, brolitName)

    // If there is already a brotli version push it
    if (fs.existsSync(brotliPath)) {
        rpushAsync(userId, brotliPath)
        return brotliPath
    }

    // If there is a local webp version compress and push it
    if (fs.existsSync(webpPath)) {
        return await compressAndStore(webpPath, brotliPath, userId)
    }

    // At this point there isn't a local brotli or webp.
    // If the url is for a webp download it
    // Or if the url is for a raw image and we don't have it - download it
    const urlIsWebp = parsedRawName.ext === WEBP_EXTENSION
    const rawPath = path.join(paths.rawImages, rawName)

    if (urlIsWebp || !fs.existsSync(rawPath)) {
        const savePath = urlIsWebp ? webpPath : rawPath
        try {
            // TODO: This is a little side-effecty but it uses the savePath provided so there's nothing to return
            await downloadImage(imageUrl, savePath)
        } catch (error) {
            logger.warn('Download failed.', {savePath}, error)
            return false
        }
    }

    // Got an image of some sort
    // If the image we have is raw convert it to webp
    if (!urlIsWebp) {
        try {
            await convertImage(rawPath, webpPath, parsedRawName.ext)
            logger.debug('Convert succeeded!')
            // TODO: Think about rm-ing the raw file. Maybe make a cron for it 🤷‍♀️
            // TODO: If ya do, diff the raw and webp dirs first
        } catch (error) {
            logger.warn('Convert failed.', {rawPath}, error)
            return false
        }
    }

    // Got a webp
    return await compressAndStore(webpPath, brotliPath, userId)
}

function compress(webpPath, brotliPath) {
    return new Promise((resolve, reject) => {

        const input = fs.createReadStream(webpPath)
        const output = fs.createWriteStream(brotliPath)

        output.on('finish', resolve)
        output.on('error', (error) => reject(error))

        const compressor = createBrotliCompress()
        input.pipe(compressor).pipe(output)
    })
}

async function compressAndStore(webpPath, brotliPath, userId) {
    try {
        // TODO: Still a little side-effecty 🤷‍♀️
        await compress(webpPath, brotliPath)
        rpushAsync(userId, brotliPath)
        return brotliPath
    } catch (error) {
        logger.warn('Brotli compress failed.', error)
        return false
    }
}

function getUrlFromAPI() {
    return new Promise((resolve, reject) => {
        apiProtocol.get(apiUrl, (response) => {
            let data = ''

            response.on('data', (chunk) => {
                data += chunk
            })
            .on('end', () => {
                if (response.statusCode !== 200) {
                    reject(new Error(`API returned non 200 status code. (${response.statusCode})`))
                    return
                }
                try {
                    const {file} = JSON.parse(data)
                    resolve(file)
                } catch (error) {
                    reject(error)
                }
            })
        })
    })
}

async function downloadImage(imageUrl, fullPath) {

    const file = fs.createWriteStream(fullPath)

    return await new Promise((resolve, reject) => {
        chooseProtocol(imageUrl).get(imageUrl, (response) => {
            response.on('data', (chunk) => {
                file.write(chunk)
            })
            .on('end', () => {
                file.end()

                if (response.statusCode !== 200) {
                    reject(new Error(`Image URL returned non 200 status code. (${response.statusCode})`))
                    return
                }
                resolve(fullPath)
            })
        })
    })
}

function convertImage(rawPath, webpPath, extname) {
    return new Promise((resolve, reject) => {

        const method = extname === '.gif' ? 'gwebp' : 'cwebp'

        webp[method](rawPath, webpPath, '-q 90', (status, error) => {
            if (error) {
                reject(error)
                return
            }

            if (status === '100') {
                resolve(webpPath)
                return
            }
            reject(`Unknown error. Status: ${status}`)
        })
    })
}
