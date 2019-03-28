const baseConfig = require('./client.base')
const generateSourceMap = process.env.OMIT_SOURCEMAP !== 'true'
const BrotliPlugin = require('brotli-webpack-plugin')

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
        ...baseConfig.plugins,
    ],
}

config.output.filename = 'bundle.[hash:8].js'

module.exports = config
