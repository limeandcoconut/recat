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
import {getOne, swapForWebp} from './controllers/img-controller'
import expressStaticGzip from 'express-static-gzip'

require('dotenv').config()

const app = express()
const auth = express.Router()

const BROTLI = 'br'

// The caching service worker must be loaded from / to be allowed to cache everything necessary
app.use('/service-worker.js', express.static(path.join(paths.clientBuild, paths.publicPath, '/service-worker.js')))

// Use Nginx or Apache to serve static assets in production
if (process.env.NODE_ENV === 'development') {
// app.use(paths.publicPath, express.static(path.join(paths.clientBuild, paths.publicPath)))
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
        manifestPath: path.join(manifestPath, '/manifest.json'),
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

    // If they don't accept brotli switch for an uncompressed webp and send
    const acceptEncoding = req.headers['accept-encoding']
    if (!acceptEncoding.includes(BROTLI)) {
        image = swapForWebp(image)
        res.sendFile(image)
        return
    }

    // Set proper headers
    res.setHeader('Vary', 'Accept-Encoding')
    res.setHeader('Content-Encoding', BROTLI)
    res.sendFile(image)
})

// TODO: Refine
auth.post('/check', async (req, res) => {
    const encryptedSession = extractSession(req)
    if (!encryptedSession) {
        res.send({success: false, error: 'not authorized'})
        return
    }
    const {response} = await authenticate(encryptedSession)

    res.send(response)
})

auth.post('/logout', async (req, res) => {
    const encryptedSession = extractSession(req)
    if (!encryptedSession) {
        res.send({success: true})
        return
    }
    const {response, cookie: newCookie} = await logout(encryptedSession)

    if (newCookie) {
        res.set('Set-Cookie', newCookie)
    }
    res.send(response)
})

app.listen(process.env.PORT || 8500, () => {
    console.log(
        `[${new Date().toISOString()}]`,
        chalk.blue(
            `App is running: 🌎 ${process.env.HOST || 'http://localhost'}:${process.env.PORT ||
            8500}`
        )
    )
})

export default app
