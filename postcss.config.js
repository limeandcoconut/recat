const paths = require('./config/paths')
const browsers = {
    // browsers: ['last 2 versions', 'ie >= 9', 'Edge <= 15'],
    browsers: ['> 1%', 'last 2 versions'],
}

// console.log(require('postcss-less'))

module.exports = {
    ident: 'postcss',
    plugins: [
        // Import from local files, node modules or web_modules.
        // https://github.com/postcss/postcss-import
        // Import from local files, node modules or web_modules.
        // https://github.com/postcss/postcss-import
        // require('postcss-less').parse,
        require('postcss-import')({
            path: [paths.srcShared],
        }),
        // require('postcss-nested')(),
        // require('postcss-custom-properties')(),
        // This project tries to fix all of flexbug's issues.
        // https://github.com/philipwalton/flexbugs
        require('postcss-flexbugs-fixes')(),
        require('autoprefixer')(browsers),
        // require('postcss-custom-properties')(),
        // Gets image sizes and inlines files.
        // https://github.com/borodean/postcss-assets
        // background: resolve('icons/baz.png');
        require('postcss-assets')({
            basePath: './assets',
        }),
        // Customizes normalize.css to your browserslist.
        // https://github.com/csstools/postcss-normalize
        require('postcss-normalize')(browsers),
    ],
    sourceMap: true,
    // sourceMap: false,
    syntax: require.resolve('postcss-less'),
}
