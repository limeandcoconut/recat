import express from 'express'
import path from 'path'
import chalk from 'chalk'
// import manifestHelpers from 'express-manifest-helpers';1
import manifestHelpers from './middleware/manifest-helpers'
import {configureStore} from '../shared/store'
import serverRender from './render'
import paths from '../../config/paths'
import bodyParser from 'body-parser'
import createHistory from '../shared/store/history'
import {succeedAuth} from '../shared/store/auth/actions'

import expressStaticGzip from 'express-static-gzip'

import featurePolicy from 'feature-policy'
import frameguard from 'frameguard'
import hsts from 'hsts'
import csp from 'helmet-csp'
import ieNoOpen from 'ienoopen'
import noSniff from 'dont-sniff-mimetype'
import xssFilter from 'x-xss-protection'
import auth from './auth'
import {authenticate} from './controllers/auth-controller'

import {extractSession} from './utils'

require('dotenv').config()

process.env.HOST = process.env.HOST || 'http://localhost'
process.env.PORT = process.env.PORT || 8500

const app = express()

// Use Nginx to serve static assets in production
if (process.env.NODE_ENV === 'development') {
    app.use(paths.publicPath, expressStaticGzip(path.join(paths.clientBuild, paths.publicPath), {
        enableBrotli: true,
        index: false,
        orderPreference: ['br'],
    }))
}

// Don't bother with security on dev
if (process.env.NODE_ENV === 'production') {
// Setup feature policy
    const contentNone = ['\'none\'']
    app.use(featurePolicy({
        features: {
            camera: [...contentNone],
            geolocation: [...contentNone],
            microphone: [...contentNone],
            payment: [...contentNone],
        },
    }))

    // Set up content-security-policy
    const contentSelf = ['\'self\'', 'recat.jacobsmith.tech', 'blob:', 'data:']
    const contentAnalytics = ['*.google-analytics.com', 'google-analytics.com']
    const contentFonts = ['*.fonts.gstatic.com', 'fonts.gstatic.com']
    app.use(csp({
        directives: {
            defaultSrc: contentSelf.concat(contentAnalytics),
            fontSrc: contentSelf.concat(contentFonts),
            prefetchSrc: contentSelf.concat(contentFonts),
            connectSrc: contentSelf.concat(contentAnalytics),
            // TODO: Add a report URI
            // reportUri
            scriptSrc: contentSelf.concat(contentAnalytics, '\'unsafe-inline\''),
        },
    }))

    // Prevent iframes embedding this page
    app.use(frameguard({action: 'deny'}))
    // Hide express
    app.disable('x-powered-by')

    // Set up hsts
    // Sets "Strict-Transport-Security: max-age=5184000; includeSubDomains".
    // const sixtyDaysInSeconds = 5184000
    // app.use(hsts({
    //   maxAge: sixtyDaysInSeconds
    // }))

    // Used for an old ie thing
    app.use(ieNoOpen())
    // Don't sniff mimetype
    app.use(noSniff())

    // Prevent xss reflection
    // Sets "X-XSS-Protection: 1; mode=block".
    app.use(xssFilter())
// TODO: Add reporting
// app.use(xssFilter({ reportUri: '/report-xss-violation' }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

// Auth router for api stuff
app.use('/auth', auth)

// Create store and atempt authentication
app.use(async (request, response, next) => {
    // Create history and store
    const history = createHistory({initialEntries: [request.url]})
    request.store = configureStore({history})

    // Check for a sesion
    const encryptedSession = extractSession(request)
    if (encryptedSession) {
        // Auth for inital load
        const {response: {success}} = await authenticate(encryptedSession)
        if (success) {
            request.store.dispatch(succeedAuth())
        }
    }

    return next()
})

// Send asset manifest
const manifestPath = path.join(paths.clientBuild, paths.publicPath)
app.use(
    manifestHelpers({
        manifestPath: path.join(manifestPath, '/asset-manifest.json'),
    })
)

// 404 and other status codes are really handled here
app.use(serverRender())

app.use((error, request, response, /* next */) => {
    return response.status(404).json({
        status: 'error',
        message: error.message,
        stack:
            // print a nicer stack trace by splitting line breaks and making them array items
            process.env.NODE_ENV === 'development' &&
            (error.stack || '')
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

app.listen(process.env.PORT, () => {
    console.log(
        `[${new Date().toISOString()}]`,
        chalk.blue(
            `App is running: 🌎 ${process.env.HOST}:${process.env.PORT}`
        )
    )
})

export default app
