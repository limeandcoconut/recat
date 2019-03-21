const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const generateSourceMap = process.env.OMIT_SOURCEMAP !== 'true'
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

// const cssRegex = /\.css$/
// const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/

const postcssOptions = require('../../postcss.config')

const babelLoader = {
    test: /\.(js|jsx|mjs)$/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: {
        plugins: [
            [
                // TODO: This. Both parts.
                require.resolve('babel-plugin-named-asset-import'),
                {
                    loaderMap: {
                        svg: {
                            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                        },
                    },
                },
            ],
        ],
        cacheDirectory: true,
        cacheCompression: process.env.NODE_ENV === 'production',
        compact: process.env.NODE_ENV === 'production',
    },
}

// const cssModuleLoaderClient = {
//     test: cssModuleRegex,
//     use: [
//         // TODO: This.
//         require.resolve('css-hot-loader'),
//         MiniCssExtractPlugin.loader,
//         {
//             loader: require.resolve('css-loader'),
//             options: {
//                 camelCase: true,
//                 modules: true,
//                 importLoaders: 1,
//                 // Why generate sourcemap here and not on server???
//                 sourceMap: generateSourceMap,
//                 // localIdentName: '[name]__[local]--[hash:base64:5]',
//                 getLocalIdent: getCSSModuleLocalIdent,
//             },
//         },
//         {
//             loader: require.resolve('postcss-loader'),
//             options: {
//                 sourceMap: generateSourceMap,
//             },
//         },
//     ],
// }

// const cssLoaderClient = {
//     test: cssRegex,
//     exclude: cssModuleRegex,
//     use: [
//         require.resolve('css-hot-loader'),
//         MiniCssExtractPlugin.loader,
//         require.resolve('css-loader'),
//         {
//             loader: require.resolve('postcss-loader'),
//             options: {
//                 sourceMap: generateSourceMap,
//             },
//         },
//     ],
// }

const lessModuleLoaderClient = {
    test: lessModuleRegex,
    use: [
        // TODO: This.
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        {
            loader: require.resolve('css-loader'),
            options: {
                camelCase: true,
                modules: true,
                importLoaders: 2,
                // Why generate sourcemap here and not on server???
                sourceMap: generateSourceMap,
                // localIdentName: '[name]__[local]--[hash:base64:5]',
                getLocalIdent: getCSSModuleLocalIdent,
            },
        },
        {
            loader: require.resolve('less-loader'),
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                // syntax: require.resolve('postcss-less'),
                // sourceMap: generateSourceMap,
                // ...postcssOptions,
            },
        },
    ],
}

const lessLoaderClient = {
    test: lessRegex,
    exclude: lessModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        require.resolve('css-loader'),
        {
            loader: require.resolve('less-loader'),
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                // syntax: require.resolve('postcss-less'),
                // sourceMap: generateSourceMap,
                // ...postcssOptions,
            },
        },
    ],
}

// TODO: Look into less and what's happening here

// Why generate sourcemap here and not in previous loader???
const lessModuleLoaderServer = {
    test: lessModuleRegex,
    use: [
        {
            loader: require.resolve('css-loader'),
            options: {
                camelCase: true,
                modules: true,
                importLoaders: 2,
                // localIdentName: '[name]__[local]--[hash:base64:5]',
                getLocalIdent: getCSSModuleLocalIdent,
                exportOnlyLocals: true,
            },
        },
        {
            loader: require.resolve('less-loader'),
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                // syntax: require.resolve('postcss-less'),
                // sourceMap: generateSourceMap,
                // ...postcssOptions,
            },
        },
    ],
}

const lessLoaderServer = {
    test: lessRegex,
    exclude: lessModuleRegex,
    use: [
        require.resolve('css-loader'),
        {
            loader: require.resolve('less-loader'),
        },
    ],
}

// const cssModuleLoaderServer = {
//     test: cssModuleRegex,
//     use: [
//         {
//             loader: require.resolve('css-loader'),
//             options: {
//                 camelCase: true,
//                 modules: true,
//                 importLoaders: 1,
//                 // localIdentName: '[name]__[local]--[hash:base64:5]',
//                 getLocalIdent: getCSSModuleLocalIdent,
//                 exportOnlyLocals: true,
//             },
//         },
//         {
//             loader: require.resolve('postcss-loader'),
//             options: {
//                 // Why generate sourcemap here and not in previous loader???
//                 sourceMap: generateSourceMap,
//             },
//         },
//     ],
// }

// const cssLoaderServer = {
//     test: cssRegex,
//     exclude: cssModuleRegex,
//     loader: require.resolve('css-loader'),
// }

// TODO: Look into asset loading
const urlLoaderClient = {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options: {
        limit: 2048,
        name: 'assets/[name].[hash:8].[ext]',
    },
}

const urlLoaderServer = {
    ...urlLoaderClient,
    options: {
        ...urlLoaderClient.options,
        emitFile: false,
    },
}

const fileLoaderClient = {
    exclude: [/\.(js|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
            },
        },
    ],
}

const fileLoaderServer = {
    exclude: [/\.(js|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
                emitFile: false,
            },
        },
    ],
}

const client = [
    {
        oneOf: [
            babelLoader,
            lessModuleLoaderClient,
            lessLoaderClient,
            urlLoaderClient,
            fileLoaderClient,
        ],
    },
]
const server = [
    {
        oneOf: [
            babelLoader,
            lessModuleLoaderServer,
            lessLoaderServer,
            urlLoaderServer,
            fileLoaderServer,
        ],
    },
]

module.exports = {
    client,
    server,
}
