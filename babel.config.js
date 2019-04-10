module.exports = {
    compact: true,
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                // targets: {
                // browsers: ['> 1%', 'last 2 versions'],
                // node: 'current',
                // },
                useBuiltIns: 'usage',
            },
        ],
        '@babel/preset-react',
    ],
    // ignore: [/@babel\/runtime/],
    sourceType: 'unambiguous',
    ignore: [/[\/\\]core-js/, /@babel[\/\\]runtime/],
    plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-transform-runtime',
            {
                regenerator: true,
            },
        ],
    ],
    env: {
        test: {
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
                '@babel/plugin-syntax-dynamic-import',
            ],
        },
    },
}

// https://babeljs.io/docs/en/babel-polyfill#usage-in-node-browserify-webpack
// https://babeljs.io/docs/en/usage
