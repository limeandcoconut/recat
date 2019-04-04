import {register, login, authenticate, logout} from './controllers/auth-controller'
import {getOne, swapForWebpPath, swapForRawPath, getFullBrotliPath} from './controllers/img-controller'
import {getFavorite, setFavorite} from './controllers/favorite-controller'
import {sleep} from '../../scripts/utils'
import {extractSession} from './utils'
import {Router as router} from 'express'
import path from 'path'

const BROTLI = 'br'
const WEBP = 'webp'

const auth = router()
/**
 * Auth api.
 * @module auth
 * @exports auth
 * @type {object} Express Router.
 */
export default auth

/**
 * @function serveAcceptableImage
 * @param  {object} request  Express like request object.
 * @param  {object} response Express like response object.
 * @param  {string} image    Absolute path to a brotli compressed image.
 * @return {object} The passed response.
 */
const serveAcceptableImage = (request, response, image) => {
    // If the client has detected that the browser wont accept webp return a raw image. You don't get brotli.
    if (request.headers.accept.includes(WEBP)) {
        image = swapForRawPath(image)
        return response.sendFile(image)
    }

    // If they don't accept brotli switch for an uncompressed webp and send
    if (!request.headers['accept-encoding'].includes(BROTLI)) {
        image = swapForWebpPath(image)
        return response.sendFile(image)
    }

    // Set proper headers
    response.setHeader('Vary', 'Accept-Encoding')
    response.setHeader('Content-Encoding', BROTLI)
    return response.sendFile(image)
}

/**
 * @function authToUser
 * @param  {object} request Express like request object
 * @return {Object} An object containing a success flag, and an error, and a userId if successful.
 */
const authToUser = async (request) => {
    // If there's a session and it checks out with the controller return the userId
    const encryptedSession = extractSession(request)
    if (encryptedSession) {
        const {response: {success}, userId} = await authenticate(encryptedSession)
        if (success) {
            return {success: true, userId}
        }
    }
    // Otherwise return an error for the client
    return {success: false, error: 'not authorized'}
}

auth.get('/images/next', async (request, response) => {
    // Auth
    const {success, userId, error} = await authToUser(request)
    if (!success) {
        response.send({success, error})
        return
    }
    // The user is authed get an image
    // Optomiztically select images from brotli compressed webps on disk
    const image = await getOne(userId)

    // Could use Condent-Disposition. I want to send the filename here but don't want the browser
    // misinterpreting it and loading it inline or as an attachment.
    // Thought about something like Content-Dispositin: invalid; filename=foo;
    // This works for now. I'll take PRs on the subject.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
    response.setHeader('file-name', path.basename(image))

    // This'll select an image and compression format basedon accepts headers then send it
    serveAcceptableImage(request, response, image)
})

auth.put('/images/favorite', async (request, response) => {
    const {success, userId, error} = await authToUser(request)
    if (!success) {
        response.send({success, error})
        return
    }
    // TODO: remove all console logs
    console.log('yo')
    await sleep(3000)
    console.log('yo2')

    // Attempt to set the save the favorite
    // The controller does validation and sanitization
    const {response: jsonResponse} = await setFavorite(request.body.id, userId)
    if (!jsonResponse.success) {
        response.send(jsonResponse)
        return
    }

    // Get a full path from the filename passed from client
    const favorite = getFullBrotliPath(jsonResponse.favorite)

    serveAcceptableImage(request, response, favorite)
})

auth.get('/images/favorite', async (request, response) => {
    const {success, userId, error} = await authToUser(request)
    if (!success) {
        response.send({success, error})
        return
    }
    // Pull from db
    // TODO: ensure anything returned like this can be sent to client and document in readme
    const {response: jsonResponse, favorite} = await getFavorite(userId)
    console.log(jsonResponse, favorite)
    if (!jsonResponse.success) {
        response.send(jsonResponse)
        return
    }

    serveAcceptableImage(request, response, favorite)
})

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

auth.post('/check', async (request, response) => {
    const {success, error} = await authToUser(request)
    response.send({success, error})
})

auth.post('/logout', async (request, response) => {
    const encryptedSession = extractSession(request)
    // If ther user wasn't authed then... fine.
    if (!encryptedSession) {
        response.send({success: true})
        return
    }
    const {response: jsonResponse, cookie: unsetCookie} = await logout(encryptedSession)

    // If the user was authed we'll get a cookie to expire the previous one
    if (unsetCookie) {
        response.set('Set-Cookie', unsetCookie)
    }
    response.send(jsonResponse)
})

