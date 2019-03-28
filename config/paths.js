const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

// let required = require.resolve('winston')
// // console.log(chalk.magenta('require.resolve("winston")'))
// // console.log(chalk.magenta(require.resolve('winston'))))
// let rootPath
// if (typeof required === 'string') {
//     rootPath = required.match(/^(.*)node_modules/)
// }
// if (typeof rootPath === 'object') {
//     rootPath = rootPath[1]
// } else {
//     rootPath = process.cwd()
// }

let rootPath = process.cwd()
// console.log(chalk.magenta(rootPath))

const appDirectory = fs.realpathSync(rootPath)
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const paths = {
    appHtml: resolveApp('config/webpack.config.js/template.html'),
    clientBuild: resolveApp('build/client'),
    serverBuild: resolveApp('build/server'),
    dotenv: resolveApp('.env'),
    src: resolveApp('src'),
    srcClient: resolveApp('src/client'),
    srcServer: resolveApp('src/server'),
    srcShared: resolveApp('src/shared'),
    publicPath: '/static/',
    webpPath: resolveApp('static/webp'),
    rawImagesPath: resolveApp('static/raw'),
    logging: resolveApp('src/shared/logging'),
}

paths.resolveModules = [
    paths.srcClient,
    paths.srcServer,
    paths.srcShared,
    paths.src,
    'node_modules',
]

module.exports = paths
