const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const env = require('../env')()

const shared = [
    new WebpackBuildNotifierPlugin({
        title: 'Webpack Build',
        suppressSuccess: true,
    }),
]

// Don't add this if a quiet build is required. This overrides the stats: {warnings: false} option
if (process.env.MUTE_PACK === 'false') {
    shared.push(
        // Adds some highlighting as sugar
        new FriendlyErrorsWebpackPlugin(),
    )
}

const client = [
    new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new webpack.DefinePlugin({
        __SERVER__: 'false',
        __BROWSER__: 'true',
    }),
    new MiniCssExtractPlugin({
        filename:
            process.env.NODE_ENV === 'development' ? '[name].css' : '[name].[contenthash].css',
        chunkFilename:
            process.env.NODE_ENV === 'development' ? '[id].css' : '[id].[contenthash].css',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ManifestPlugin({fileName: 'asset-manifest.json'}),
]

const server = [
    new webpack.DefinePlugin({
        __SERVER__: 'true',
        __BROWSER__: 'false',
    }),
]

module.exports = {
    shared,
    client,
    server,
}
