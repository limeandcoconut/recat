const path = require('path')
const fs = require('fs')

let rootPath = require.resolve('winston').match(/^(.*)node_modules/)
if (rootPath) {
    rootPath = rootPath[1]
} else {
    rootPath = process.cwd()
}

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
