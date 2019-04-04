// import React from 'react';
import express from 'express'
import cors from 'cors'
import path from 'path'
import chalk from 'chalk'
// import manifestHelpers from 'express-manifest-helpers';
import manifestHelpers from './middleware/manifest-helpers'
import {configureStore} from '../shared/store'
import serverRender from './render'
import paths from '../../config/paths'
import bodyParser from 'body-parser'
import createHistory from '../shared/store/history'
import {succeedAuth} from '../shared/store/auth/actions'

import {register, login, authenticate, logout} from './controllers/auth-controller'
import {getOne, swapForWebpPath, swapForRawPath, getFullBrotliPath} from './controllers/img-controller'
import expressStaticGzip from 'express-static-gzip'
import {getFavorite, setFavorite} from './controllers/favorite-controller'
import {sleep} from '../../scripts/utils'

import featurePolicy from 'feature-policy'
import frameguard from 'frameguard'
import hsts from 'hsts'
import ieNoOpen from 'ienoopen'
import noSniff from 'dont-sniff-mimetype'
import xssFilter from 'x-xss-protection'

require('dotenv').config()

process.env.HOST = process.env.HOST || 'http://localhost'
process.env.PORT = process.env.PORT || 8500

const app = express()
const auth = express.Router()

const BROTLI = 'br'

// Use Nginx to serve static assets in production
if (process.env.NODE_ENV === 'development') {
    app.use(paths.publicPath, expressStaticGzip(path.join(paths.clientBuild, paths.publicPath), {
        enableBrotli: true,
        index: false,
        orderPreference: ['br'],
    }))
    app.use('/favicon.ico', (req, res) => {
        res.send('')
    })
}

app.use(cors())

// const contentSelf = ['\'self\'', '*recat.jacobsmith.tech*', '*localhost*', '*']

// //  helmet-csp
// app.use(csp({
//     directives: {
//         defaultSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         // scriptSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         // fontSrc: contentSelf.concat(['*.fonts.gstatic0.com', 'fonts.gstatic.com']),
//         // prefetchSrc: contentSelf.concat(['*.fonts.gstatic0.com', 'fonts.gstatic.com']),
//         connectSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         imgSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         // styleSrc: contentSelf.concat('*.fonts.gstatic.com'),
//         // TODO: Add a report uri.
//         // reportUri

//         scriptSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         styleSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         // imgSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         // connectSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         fontSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         objectSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         mediaSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         frameSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         // reportUri: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         childSrc: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         formAction: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         // frameAncestors: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//         // pluginTypes: contentSelf.concat(['*.google-analytics.com', 'google-analytics.com']),
//     },
// }))

const contentNone = ['\'none\'']
// feature-policy
app.use(featurePolicy({
    features: {
        vibrate: [...contentNone],
        camera: [...contentNone],
        geolocation: [...contentNone],
        microphone: [...contentNone],
        payment: [...contentNone],
    },
}))

// frameguard
app.use(frameguard({action: 'deny'}))

app.disable('x-powered-by')

// hsts
// Sets "Strict-Transport-Security: max-age=5184000; includeSubDomains".
// const sixtyDaysInSeconds = 5184000
// app.use(hsts({
//   maxAge: sixtyDaysInSeconds
// }))

// ienoopen
// Sets "X-Download-Options: noopen".
app.use(ieNoOpen())

// dont-sniff-mimetype
app.use(noSniff())

// x-xss-protection
// Sets "X-XSS-Protection: 1; mode=block".
app.use(xssFilter())
// TODO: Add reporting
// app.use(xssFilter({ reportUri: '/report-xss-violation' }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use('/auth', auth)

const extractSession = (req) => {
    const cookie = req.header('cookie')
    if (!cookie) {
        return false
    }
    let match = cookie.match(/session=(\w+)/)
    return match && match[1] ? match[1] : false
}

app.use(async (req, res, next) => {
    const history = createHistory({initialEntries: [req.url]})
    req.store = configureStore({history})

    const encryptedSession = extractSession(req)
    if (encryptedSession) {
        const {response: {success}} = await authenticate(encryptedSession)
        if (success) {
            req.store.dispatch(succeedAuth())
        }
    }

    return next()
})

const manifestPath = path.join(paths.clientBuild, paths.publicPath)

app.use(
    manifestHelpers({
        manifestPath: path.join(manifestPath, '/asset-manifest.json'),
    })
)

app.use(serverRender())

app.use((err, req, res, /* next */) => {
    return res.status(404).json({
        status: 'error',
        message: err.message,
        stack:
            // print a nicer stack trace by splitting line breaks and making them array items
            process.env.NODE_ENV === 'development' &&
            (err.stack || '')
            .split('\n')
            .map((line) => line.trim())
            .map((line) => line.split(path.sep).join('/'))
            .map((line) =>
                line.replace(
                    process
                    .cwd()
                    .split(path.sep)
                    .join('/'),
                    '.'
                )
            ),
    })
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

app.listen(process.env.PORT, () => {
    console.log(
        `[${new Date().toISOString()}]`,
        chalk.blue(
            `App is running: 🌎 ${process.env.HOST}:${process.env.PORT}`
        )
    )
})

export default app
