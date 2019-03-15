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
import createHistory from '../shared/store/history'

require('dotenv').config()

const app = express()

// Use Nginx or Apache to serve static assets in production or remove the if() around the following
// lines to use the express.static middleware to serve assets for production (not recommended!)
if (process.env.NODE_ENV === 'development') {
    app.use(paths.publicPath, express.static(path.join(paths.clientBuild, paths.publicPath)))
    app.use('/favicon.ico', (req, res) => {
        res.send('')
    })
}

app.use(cors())

app.use((req, res, next) => {
    const history = createHistory({initialEntries: [req.url]})
    req.store = configureStore({history})
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
