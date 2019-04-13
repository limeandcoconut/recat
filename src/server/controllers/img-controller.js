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

// TODO: Consider moving this magic number to a config somplace. Doesn't seem right for config/env.js 🤷‍♀️
const requiredImages = 5
// TODO: Maybe config for this
const apiUrl = 'http://aws.random.cat/meow'

const isHttps = (url) => /^https/.test(url)
const chooseProtocol = (url) => isHttps(url) ? https : http
const apiProtocol = chooseProtocol(apiUrl)

const WEBP_EXTENSION = '.webp'
const BROTLI_EXTENSION = '.br'

// TODO: These are fragile as they only work with paths. Should change.
/**
 * Extract the base and *first* extension of the provided path and return a path to a .webp.br.
 * @exports swapForBrotliPath
 * @function swapForBrotliPath
 * @param {string} imagePath A path or filename to be converted to a brotli compressed image path.
 * @return {string} The full path to a brotli compressed image.
 */
export const swapForBrotliPath = (imagePath) => path.join(
    paths.brotliImages,
    imagePath.match(/([^\.\/]+\.\w+)/)[1] + WEBP_EXTENSION + BROTLI_EXTENSION
)
/**
 * Extract the base and *first* extension of the provided path and return a path to a .webp.
 * @exports swapForWebpPath
 * @function swapForWebpPath
 * @param {string} imagePath A path or filename to be converted to a webp image path.
 * @return {string} The full path to a webp image.
 */
export const swapForWebpPath = (imagePath) => path.join(
    paths.webpImages,
    imagePath.match(/([^\.\/]+\.\w+)/)[1] + WEBP_EXTENSION
)
/**
 * Extract the base and *first* extension of the provided path and return a path to an image.
 * @exports swapForRawPath
 * @function swapForRawPath
 * @param {string} imagePath A path or filename to be converted to a raw image path.
 * @return {string} The full path to a raw image.
 */
export const swapForRawPath = (imagePath) => path.join(
    paths.rawImages,
    imagePath.match(/([^\.\/]+\.\w+)/)[1]
)

/**
 * Takes the name of a brotli compressed image and joins the brotli dir.
 * @exports getFullBrotliPath
 * @function getFullBrotliPath
 * @param {string} brotliFileName The name of a brotli compressed image
 * @return {string} The full path to a brotli compressed image.
 */
export const getFullBrotliPath = (brotliFileName) => path.join(paths.brotliImages, brotliFileName)

/**
 * Randomly chooses 5 brotli compressed webps from disk.
 * @function getImagesQueueFromDisk
 * @return {array} An array of 5 paths to brotli compressed webps on disk.
 */
function getImagesQueueFromDisk() {
    const images = fs.readdirSync(paths.brotliImages, {encoding: 'utf8'})

    if (!images || images.length < requiredImages) {
        throw new Error(`Not enough images in ${paths.brotliImages}. ` +
        `Please seed with at least ${requiredImages} images.`)
    }

    const imagesCount = images.length

    // Pick 5 images at random.
    const queue = new Array(requiredImages).fill().map(() => {
        const randomIndex = Math.floor(Math.random() * imagesCount)
        return path.join(paths.brotliImages, images[randomIndex])
    })

    return queue
}

/**
 * Returns an array of 5 paths to brotli compressed webps.
 * Will pull from redis first. If there's no list in redis it will use getImagesQueueFromDisk to select 5 and store them
 * in redis before returning.
 * @function getImagesQueue
 * @param  {string} userId A user id used as a redis key.
 * @return {string} An array of 5 paths to brotli compressed webps on disk.
 */
async function getImagesQueue(userId) {
    let images = await lrangeAsync(userId, 0, -1)

    if (images && images.length) {
        return images
    }

    images = getImagesQueueFromDisk()

    rpushAsync(userId, ...images)
    return images
}

/**
 * Get an absolute path to a brotli compressed image on disk and request another from the public api.
 * @function getOne
 * @param  {string} userId A user id used as a redis key.
 * @return {string} A path to a brotli compressed webp on disk.
 */
export async function getOne(userId) {
    // Start the async process to get a new image
    requestNewImageFromAPI(userId)

    // Get images to show
    const images = await getImagesQueue(userId)

    // Redis has atomicity and concurrency but not parallelism so this shouldn't be an issue
    rpopAsync(userId)

    // Pop the next one from memory and return it
    // This will always be brotli compressed, we're optimistic 😄
    return images.pop()
}

// TODO: consider resizing images
/**
 * Request an image from the public api. Download it. If it's not a webp convert it. Brotli compress. Save in different
 * directories.
 * If at any point after inital download this process fails it will log a warning and leave the intermediate images
 * so the process can be resumed later.
 * If a url is retrieved for an image that is alredy on disk, it'll be used. If the conversion and compression
 * process was previously abandoned reattempt.
 * @function requestNewImageFromAPI
 * @param  {string} userId A user id used as a redis key.
 * @return {string} An absolute path to a brotli compressed webp of the image retrieved. Boolean false on failure.
 */
async function requestNewImageFromAPI(userId) {
    // Attempt to get an image url. If we don't just quit.
    // Lets assume that they're using some super secret special sauce that justifies not downloading the whole
    // collection and choosing local files randomly every time. Supposed to use the endpoint right? Cool, this sounds
    // like an absurdly fun, contrived flow.
    let imageUrl
    try {
        imageUrl = await getUrlFromAPI()
    } catch (error) {
        logger.warn('Url fetch failed.', {error})
        return false
    }

    // Got a URL
    // Sanitize filename for all filesystems
    const pathname = url.parse(imageUrl).pathname
    const rawName = filenamify(pathname)

    // Generate webp filename.
    const parsedRawName = path.parse(rawName)
    const webpName = parsedRawName.base + WEBP_EXTENSION
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
            // This is a little side-effecty but it uses the savePath provided so there's nothing to return
            await downloadImage(imageUrl, savePath)
        } catch (error) {
            logger.warn('Download failed.', {savePath, error})
            return false
        }
    }

    // Got an image of some sort
    // If the image we have is raw convert it to webp
    if (!urlIsWebp) {
        try {
            await convertImage(rawPath, webpPath, parsedRawName.ext)
        } catch (error) {
            logger.warn('Convert failed.', {rawPath, error})
            return false
        }
    }

    // Got a webp
    return await compressAndStore(webpPath, brotliPath, userId)
}

/**
 * Compress a webp using brotli.
 * @function compress
 * @param  {strging} webpPath An absolute path to a webp on disk.
 * @param  {string} brotliPath An absolute path to save the brotli compressed file to.
 * @return {promise} A promise that is resolved with the completed file path.
 */
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

/**
 * Compress a webp using brotli and push it to a user's list in redis if successful.
 * @function compressAndStore
 * @param  {string} webpPath   An absolute path to a webp on disk.
 * @param  {string} brotliPath An absolute path to save the brotli compressed file to.
 * @param  {string} userId     A user id used as a redis key.
 * @return {string} The path to the newly compressed file.
 */
async function compressAndStore(webpPath, brotliPath, userId) {
    try {
        await compress(webpPath, brotliPath)
        rpushAsync(userId, brotliPath)
        return brotliPath
    } catch (error) {
        logger.warn('Brotli compress failed.', {error})
        return false
    }
}

/**
 * Get a file url from the public api.
 * @function getUrlFromAPI
 * @return {promise} A promise that resolves to a url to an image of a kitty cat.
 */
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

/**
 * Download an image from the url provided and save it to the path provided.
 * @function downloadImage
 * @param  {string} imageUrl A url to a publicly hosted image to download.
 * @param  {string} fullPath An absolute path to save the image to.
 * @return {promise} A promise which resolves to the path of the newly downloaded image.
 */
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

/**
 * Convert an image to webp.
 * @function convertImage
 * @param  {string} rawPath  An absolute path to the image to convert.
 * @param  {string} webpPath An absolute path to save the image to.
 * @param  {string} extname  The extension of the existing image.
 * @return {string} The absolute path the webp was saved to.
 */
function convertImage(rawPath, webpPath, extname) {
    return new Promise((resolve, reject) => {

        const method = extname === '.gif' ? 'gwebp' : 'cwebp'
        // Quality 90%
        webp[method](rawPath, webpPath, '-q 90 -v', (status, error) => {
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
