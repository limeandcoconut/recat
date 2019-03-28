import {rpopAsync, lrangeAsync, rpushAsync} from '../models/redis'
import fs from 'fs'
import chalk from 'chalk'
/* eslint-disable require-jsdoc */
import {webpPath, rawImagesPath} from '.././../../config/paths'
import logger from '../../shared/logging/logger'
import webp from 'webp-converter'
import path from 'path'
import url from 'url'
import http from 'http'
import https from 'https'
import filenamify from 'filenamify'

// TODO: Consider moving this magic number to a config somplace. Doesn't seem right for config/env.js 🤷‍♀️
const requiredImags = 5
// TODO: Maybe config for this
const apiUrl = 'http://aws.random.cat/meow'
const WEBP_EXTENSION = '.webp'
const isHttps = (url) => /^https/.test(url)
const chooseProtocol = (url) => isHttps(url) ? https : http
const apiProtocol = chooseProtocol(apiUrl)

function getImagesQueueFromDisk() {
    const images = fs.readdirSync(webpPath, {encoding: 'utf8'})

    if (!images || images.length < requiredImags) {
        throw new Error(`Not enough images in ${webpPath}. Please seed with at least ${requiredImags} images.`)
    }

    const imagesCount = images.length

    const queue = new Array(requiredImags).fill().map(() => {
        const randomIndex = Math.floor(Math.random() * imagesCount)
        return path.join(webpPath, images[randomIndex])
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
    const images = await getImagesQueue(userId)
    // Redis has atomicity and concurrency but not parallelism so this shouldn't be an issue
    rpopAsync(userId)

    // Start the async process to get a new image
    requestNewImageFromAPI(userId)

    // Pop the next one from memory and return it
    return images.pop()
}

// TODO: consider resizing images
async function requestNewImageFromAPI(userId) {
    // Attempt to get an image url. If we don't just quit.
    let imageUrl
    try {
        imageUrl = await getUrlFromAPI()
    } catch (error) {
        logger.warn('Url fetch failed.', error)
        return false
    }

    // Sanitize filename for all filesystems
    const pathname = url.parse(imageUrl).pathname
    const rawName = filenamify(pathname)

    // Generate webp filename.
    const parsedRawName = path.parse(rawName)
    const webpName = parsedRawName.name + WEBP_EXTENSION
    const webpFullPath = path.join(webpPath, webpName)

    // If there isn't yet a local webp version, get one
    if (fs.existsSync(webpFullPath)) {
        rpushAsync(userId, webpFullPath)
        return webpFullPath
    }

    // If the url is already for a webp, download it to the webp dir
    if (parsedRawName.ext === WEBP_EXTENSION) {
        try {
            // TODO: This is a little side-effecty but there's nothing to return, It uses the webpFullPath
            await downloadImage(imageUrl, webpFullPath)
        } catch (error) {
            logger.warn('Webp download failed.', {webpFullPath}, error)
            return false
        }
        logger.debug('Webp downloaded!')
        rpushAsync(userId, webpFullPath)
        return webpFullPath
    }

    // Evidently the url is not for a webp.
    // If there isn't yet a local raw version, get one.
    const rawFullPath = path.join(rawImagesPath, rawName)
    if (!fs.existsSync(rawFullPath)) {
        try {
            // TODO: This is still a little side-effecty 🤷‍♀️
            await downloadImage(imageUrl, rawFullPath)
        } catch (error) {
            logger.warn('Raw download failed.', {rawFullPath}, error)
            return false
        }
    }

    // Convert the raw image to webp
    try {
        await convertImage(rawFullPath, webpFullPath, parsedRawName.ext)
    } catch (error) {
        logger.warn('Convert failed.', {rawFullPath}, error)
        return false
    }

    // TODO: Think about rm-ing the raw file. Maybe make a cron for it 🤷‍♀️

    logger.debug('Convert succeeded!')
    rpushAsync(userId, webpFullPath)
    return webpFullPath
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

function convertImage(rawFullPath, webpFullPath, extname) {
    return new Promise((resolve, reject) => {

        const method = extname === '.gif' ? 'gwebp' : 'cwebp'

        webp[method](rawFullPath, webpFullPath, '-q 90', (status, error) => {
            if (error) {
                reject(error)
                return
            }

            if (status === '100') {
                resolve(webpFullPath)
                return
            }
            reject(`Unknown error. Status: ${status}`)
        })
    })
}
