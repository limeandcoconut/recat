const baseConfig = require('./client.base')
const generateSourceMap = process.env.OMIT_SOURCEMAP !== 'true'
const BrotliPlugin = require('brotli-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const path = require('path')
const paths = require('../paths')

const config = {
    ...baseConfig,
    mode: 'production',
    // TODO: learn more about sourcemaps
    devtool: generateSourceMap ? 'source-map' : false,
    plugins: [
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.js$|\.css$/,
            threshold: 0,
            // minRatio: 0.8,
        }),
        // It'd be best to read options for this and cater to specific project needs
        // https://www.npmjs.com/package/sw-precache-webpack-plugin
        new SWPrecacheWebpackPlugin({
            filename: 'service-worker.js',
            // staticFileGlobs: ['dist/**/*.{js,html,css}'],
            // minify: true,
            // stripPrefix: 'dist/',
            runtimeCaching: [{
                urlPattern: '/*',
                handler: 'networkFirst',
                // Options:
                // cacheFirst
                // fastest
                // networkOnly
                // cacheOnly
                // Why u no slowest()?
            }],
            staticFileGlobs: [
                path.join(paths.publicPath, '/**.css'),
                // path.join(paths.publicPath, '/img/**.*'),
                path.join(paths.publicPath, '/**.js'),
                // path.join(paths.publicAssetPath, '/**.woff*'),
                path.join(paths.publicAssetPath, '/**'),
            ],
            // Don't allow the service worker to try to cache google analytics or your tracking will stop working
            // Disable any other scripts you don't want cached here as well
            staticFileGlobsIgnorePatterns: [/google-analytics.com/],
        }),
        ...baseConfig.plugins,
    ],
}

console.log([
    path.join(paths.publicPath, '/**.css'),
    path.join(paths.publicPath, '/img/**.*'),
    path.join(paths.publicPath, '/**.js'),
    // path.join(paths.publicAssetPath, '/**.woff*'),
    path.join(paths.publicAssetPath, '/**'),
])

config.output.filename = 'bundle.[hash:8].js'

module.exports = config
