const path = require('path')
const paths = require('../paths')
const {client: clientLoaders} = require('./loaders')
const resolvers = require('./resolvers')
const plugins = require('./plugins')

module.exports = {
    name: 'client',
    target: 'web',
    entry: {
        bundle: [
            `${paths.srcClient}/index.js`,
        ],
    },
    output: {
        path: path.join(paths.clientBuild, paths.publicPath),
        filename: '[name]bundle.js',
        publicPath: paths.publicPath,
        chunkFilename: '[id].chunk.js',
    },
    module: {
        rules: clientLoaders,
    },
    resolve: {...resolvers},
    plugins: [...plugins.shared, ...plugins.client],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty', // eslint-disable-line camelcase
    },
    optimization: {
        namedModules: true,
        noEmitOnErrors: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    stats: {
        cached: false,
        cachedAssets: false,
        chunks: false,
        chunkModules: false,
        colors: true,
        hash: false,
        modules: false,
        reasons: false,
        timings: true,
        version: false,
        warnings: process.env.MUTE_PACK === 'false',
        children: process.env.MUTE_PACK === 'false',
    },
}
