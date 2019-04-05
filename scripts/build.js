const webpack = require('webpack')
const rimraf = require('rimraf')
const promisify = require('util.promisify')
const rimrafAsync = promisify(rimraf).bind(rimraf)
const chalk = require('chalk')

// Ensure this is set before webpack.config.js requires env.js downstream
process.env.HOST = process.env.HOST || 'http://localhost'
const HOST = process.env.HOST

const webpackConfig = require('../config/webpack.config.js')(process.env.NODE_ENV || 'production')
const paths = require('../config/paths')
const {compilerPromise, sleep} = require('./utils')

// Use puppeteer to generate static html if you want
let generateStaticHTML
if (process.env.GEN_HTML) {
    generateStaticHTML = async () => {
        const {choosePort} = require('react-dev-utils/WebpackDevServerUtils')
        const nodemon = require('nodemon')
        const fs = require('fs')
        const puppeteer = require('puppeteer')
        const PORT = await choosePort('localhost', 8505)

        // Server will use this process.env, Client side has had it wepbackDefined in
        process.env.PORT = PORT

        console.log(chalk.blue(`Puppeteer generating static HTML from: ${HOST}:${PORT}`))
        const script = nodemon({
            script: `${paths.serverBuild}/server.js`,
            ignore: ['*'],
        })

        script.on('start', async () => {
            try {
                // TODO: add try/wait/retry here instead of just generally waiting for 2000 ms
                await sleep(2000)
                const browser = await puppeteer.launch()
                const page = await browser.newPage()
                await page.goto(`${HOST}:${PORT}`)
                const pageContent = await page.content()
                fs.writeFileSync(`${paths.clientBuild}/index.html`, pageContent)
                await browser.close()
                script.emit('quit')
            } catch (err) {
                script.emit('quit')
                console.log(err)
            }
        })

        script.on('exit', (code) => {
            process.exit(code)
        })

        script.on('crash', () => {
            process.exit(1)
        })
    }
}

const build = async () => {
    // Akin to Promise.all()
    const rimrafClientPromse = rimrafAsync(paths.clientBuild)
    const rimrafServerPromse = rimrafAsync(paths.serverBuild)
    await rimrafClientPromse
    await rimrafServerPromse

    const [clientConfig, serverConfig] = webpackConfig
    const multiCompiler = webpack([clientConfig, serverConfig])

    // This is slick but could be faster with an if else
    const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')
    const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')

    const clientPromise = compilerPromise('client', clientCompiler)
    const serverPromise = compilerPromise('server', serverCompiler)

    serverCompiler.watch({}, (error, stats) => {
        if (!error && !stats.hasErrors()) {
            console.log(stats.toString(serverConfig.stats))
            return
        }
    })

    clientCompiler.watch({}, (error, stats) => {
        if (!error && !stats.hasErrors()) {
            console.log(stats.toString(clientConfig.stats))
            return
        }
    })

    // Wait until client and server is compiled
    try {
        await serverPromise
        await clientPromise

        console.log(chalk.magenta('\nCompilation done!'))
        if (process.env.GEN_HTML) {
            await generateStaticHTML()
        } else {
            process.exit(0)
        }
    } catch (error) {
        console.log(chalk.red(error))
        process.exit(1)
    }
}

build()
