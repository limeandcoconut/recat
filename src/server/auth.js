import {register, login, authenticate, logout} from './controllers/auth-controller'
import {getOne, swapForWebpPath, swapForRawPath, getFullBrotliPath} from './controllers/img-controller'
import {getFavorite, setFavorite} from './controllers/favorite-controller'
import {sleep} from '../../scripts/utils'
import {extractSession} from './utils'
import express from 'express'
import path from 'path'

const auth = express.Router() // eslint-disable-line new-cap
export default auth

const BROTLI = 'br'

auth.post('/register', async (req, res) => {
    const {response} = await register(req.body)
    res.send(response)
})

auth.post('/login', async (req, res) => {
    const {response, cookie} = await login(req.body)
    if (cookie) {
        res.set('Set-Cookie', cookie)
    }
    res.send(response)
})

// TODO: Consider returning a list of images and keeping a few on client side.
auth.get('/images/next', async (req, res) => {
    const encryptedSession = extractSession(req)
    if (!encryptedSession) {
        res.send({success: false, error: 'not authorized'})
        return
    }
    const {response: {success}, userId} = await authenticate(encryptedSession)

    if (!success) {
        res.send({success: false, error: 'not authorized'})
        return
    }
    // The user is authed get an image
    let image = await getOne(userId)

    // Could use Condent-Disposition. I want to send the filename here but don't want the browser
    // misinterpreting it and loading it inline or as an attachment.
    // Thought about something like Content-Dispositin: invalid; filename=foo;
    // This works for now. I'll take PRs on the subject.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
    res.setHeader('file-name', path.basename(image))

    // TODO: Refine
    // If the client has detected that the browser wont accept webp return a raw image. You don't get brotli.
    if (req.headers.accept !== 'image/webp') {
        image = swapForRawPath(image)
        res.sendFile(image)
        return
    }

    // If they don't accept brotli switch for an uncompressed webp and send
    const acceptEncoding = req.headers['accept-encoding']
    if (!acceptEncoding.includes(BROTLI)) {
        image = swapForWebpPath(image)
        res.sendFile(image)
        return
    }
    // Set proper headers
    res.setHeader('Vary', 'Accept-Encoding')
    res.setHeader('Content-Encoding', BROTLI)
    res.sendFile(image)
})

auth.put('/images/favorite', async (request, response) => {
    const encryptedSession = extractSession(request)
    if (!encryptedSession) {
        response.send({success: false, error: 'not authorized'})
        return
    }
    const {response: {success}, userId} = await authenticate(encryptedSession)

    if (!success) {
        response.send({success: false, error: 'not authorized'})
        return
    }
    console.log('yo')
    await sleep(3000)
    console.log('yo2')

    let {response: jsonResponse} = await setFavorite(request.body.id, userId)
    if (!jsonResponse.success) {
        response.send(jsonResponse)
    }
    let favorite = getFullBrotliPath(jsonResponse.favorite)

    // TODO: Refine
    // If the client has detected that the browser wont accept webp return a raw image. You don't get brotli.
    if (request.headers.accept !== 'image/webp') {
        favorite = swapForRawPath(favorite)
        response.sendFile(favorite)
        return
    }

    // If they don't accept brotli switch for an uncompressed webp and send
    const acceptEncoding = request.headers['accept-encoding']
    if (!acceptEncoding.includes(BROTLI)) {
        favorite = swapForWebpPath(favorite)
        response.sendFile(favorite)
        return
    }

    // Set proper headers
    response.setHeader('Vary', 'Accept-Encoding')
    response.setHeader('Content-Encoding', BROTLI)
    response.sendFile(favorite)
})

auth.get('/images/favorite', async (request, response) => {
    const encryptedSession = extractSession(request)
    if (!encryptedSession) {
        response.send({success: false, error: 'not authorized'})
        return
    }
    const {response: {success}, userId} = await authenticate(encryptedSession)

    if (!success) {
        response.send({success: false, error: 'not authorized'})
        return
    }
    // TODO: ensure anything returned like this can be sent to client
    let {response: {favorite}} = await getFavorite(userId)
    // If the client has detected that the browser wont accept webp return a raw image. You don't get brotli.
    if (request.headers.accept !== 'image/webp') {
        favorite = swapForRawPath(favorite)
        response.sendFile(favorite)
        return
    }

    // If they don't accept brotli switch for an uncompressed webp and send
    const acceptEncoding = request.headers['accept-encoding']
    if (!acceptEncoding.includes(BROTLI)) {
        favorite = swapForWebpPath(favorite)
        response.sendFile(favorite)
        return
    }

    // Set proper headers
    response.setHeader('Vary', 'Accept-Encoding')
    response.setHeader('Content-Encoding', BROTLI)
    response.sendFile(favorite)
})

// TODO: Refine
auth.post('/check', async (request, response) => {
    const encryptedSession = extractSession(request)
    if (!encryptedSession) {
        response.send({success: false, error: 'not authorized'})
        return
    }
    const {response: jsonResponse} = await authenticate(encryptedSession)

    response.send(jsonResponse)
})

auth.post('/logout', async (request, response) => {
    const encryptedSession = extractSession(request)
    if (!encryptedSession) {
        response.send({success: true})
        return
    }
    const {response: jsonResponse, cookie: newCookie} = await logout(encryptedSession)

    if (newCookie) {
        response.set('Set-Cookie', newCookie)
    }
    response.send(jsonResponse)
})
