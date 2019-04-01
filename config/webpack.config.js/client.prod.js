const baseConfig = require('./client.base')
const generateSourceMap = process.env.OMIT_SOURCEMAP !== 'true'
const BrotliPlugin = require('brotli-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const path = require('path')
const paths = require('../paths')
const SitemapPlugin = require('sitemap-webpack-plugin').default // 😬
const RobotstxtPlugin = require('robotstxt-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const {productionHost} = require('../config.js')
const siteMeta = require('../meta')
const CopyPlugin = require('copy-webpack-plugin')

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
        }),
        // It'd be best to read options for this and cater to specific project needs
        // https://www.npmjs.com/package/sw-precache-webpack-plugin
        new SWPrecacheWebpackPlugin({
            filename: 'service-worker.js',
            minify: true,
            runtimeCaching: [{
                urlPattern: '/*',
                handler: 'networkFirst',
                // Options:
                // cacheFirst
                // fastest
                // networkOnly
                // cacheOnly
                // WHY U NO slowest()?
            }],
            staticFileGlobs: [
                path.join(paths.publicPath, '/**.css'),
                path.join(paths.publicPath, '/**.js'),
                path.join(paths.publicAssetPath, '/**'),
            ],
            // Don't allow the service worker to try to cache google analytics or your tracking will stop working
            // Disable any other scripts you don't want cached here as well
            staticFileGlobsIgnorePatterns: [/google-analytics.com/],
        }),
        new SitemapPlugin(productionHost, [
            {
                path: '/',
                priority: 1,
            },
            {
                path: '/login',
                priority: 0.8,
            },
            {
                path: '/register',
                priority: 0.8,
            },
        ], {
            lastMod: true,
            skipGzip: true,
            // This is a total rubbish hack but it's uh workun guud for now.
            fileName: '../sitemap.xml',
        }),
        new RobotstxtPlugin({
            policy: [
                {
                    userAgent: '*',
                    allow: '/',
                },
            ],
            sitemap: path.join(productionHost, 'sitemap.xml'),
            host: productionHost,
            // This is a total rubbish hack but it's uh workun guud for now.
            filePath: '../robots.txt',
        }),
        /* eslint-disable camelcase */
        // These paths are joined here so that
        // path, paths, and subsequently fs are not included on client where this is use
        new WebpackPwaManifest({
            name: siteMeta.name,
            short_name: siteMeta.short_name,
            description: siteMeta.description,
            background_color: siteMeta.color,
            theme_color: siteMeta.color,
            // crossorigin: 'use-credentials', // can be null, use-credentials or anonymous
            icons: siteMeta.manifestIcons.map(({src, ...rest}) => {
                return {
                    src: path.join(paths.sharedMeta, src),
                    ...rest,
                }
            }),
            filename: 'manifest.json',
            display: siteMeta.display,
            start_url: siteMeta.start_url,
            inject: false,
            fingerprints: false,
            ios: false,
            includeDirectory: false,
        }),
        new CopyPlugin(siteMeta.copyMeta.map(({from, to}) => {
            return {
                from: path.join(paths.sharedMeta, from),
                to,
            }
        })),
        ...baseConfig.plugins,
    ],
}

config.output.filename = 'bundle.[hash:8].js'

module.exports = config
