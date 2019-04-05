const webpack = require('webpack')
const nodemon = require('nodemon')
const rimraf = require('rimraf')
const promisify = require('util.promisify')
const rimrafAsync = promisify(rimraf).bind(rimraf)
const express = require('express')
const chalk = require('chalk')
const webpackConfig = require('../config/webpack.config.js')(process.env.NODE_ENV || 'development')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const paths = require('../config/paths')
const {compilerPromise} = require('./utils')

const app = express()

const WEBPACK_PORT =
    process.env.WEBPACK_PORT ||
    (!isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) + 1 : 8501)

const DEVSERVER_HOST = process.env.DEVSERVER_HOST || 'http://localhost'

const start = async () => {
    // Clean
    // Akin to Promise.all()
    const rimrafClientPromse = rimrafAsync(paths.clientBuild)
    const rimrafServerPromse = rimrafAsync(paths.serverBuild)
    await rimrafClientPromse
    await rimrafServerPromse

    // Add hot middleware
    const [clientConfig, serverConfig] = webpackConfig
    clientConfig.entry.bundle = [
        `webpack-hot-middleware/client?path=${DEVSERVER_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
        ...clientConfig.entry.bundle,
    ]

    clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json'
    clientConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js'

    const publicPath = clientConfig.output.publicPath

    // TODO: Couldn't this be interpolated for clarity
    clientConfig.output.publicPath = [`${DEVSERVER_HOST}:${WEBPACK_PORT}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/')

    serverConfig.output.publicPath = [`${DEVSERVER_HOST}:${WEBPACK_PORT}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/')

    const multiCompiler = webpack([clientConfig, serverConfig])

    // Could be faster with an if else
    const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')
    const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')

    const clientPromise = compilerPromise('client', clientCompiler)
    const serverPromise = compilerPromise('server', serverCompiler)

    const watchOptions = {
        // poll: true,
        ignored: /node_modules/,
        stats: clientConfig.stats,
    }

    // Serve hot middleware
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        return next()
    })

    app.use(
        webpackDevMiddleware(clientCompiler, {
            publicPath: clientConfig.output.publicPath,
            stats: clientConfig.stats,
            watchOptions,
        })
    )

    app.use(webpackHotMiddleware(clientCompiler))

    app.use('/static', express.static(paths.clientBuild))

    app.listen(WEBPACK_PORT)

    // Have the server watch too
    serverCompiler.watch(watchOptions, (error, stats) => {
        if (!error && !stats.hasErrors()) {
            console.log(stats.toString(serverConfig.stats))
            return
        }

        if (error) {
            console.log(chalk.red(error))
        }

        if (stats.hasErrors()) {
            const info = stats.toJson()
            const errors = info.errors[0].split('\n')
            console.log(chalk.red(errors[0]))
            console.log(chalk.red(errors[1]))
            console.log(chalk.red(errors[2]))
        }
    })

    // Wait until client and server are compiled
    try {
        await serverPromise
        await clientPromise
    } catch (error) {
        console.log(chalk.red(error))
    }

    // Start server and watch
    const script = nodemon({
        script: `${paths.serverBuild}/server.js`,
        ignore: ['src', 'scripts', 'config', './*.*', 'build/client'],
    })

    script.on('restart', () => {
        console.log(chalk.yellow('Server side app has been restarted.'))
    })

    script.on('quit', () => {
        console.log('Process ended')
        process.exit()
    })

    script.on('error', () => {
        console.log(chalk.red('An error occured. Exiting'))
        process.exit(1)
    })
}

// Go go gadget everything!
start()
