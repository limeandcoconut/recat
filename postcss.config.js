const paths = require('./config/paths')
const browsers = {
    // browsers: ['last 2 versions', 'ie >= 9', 'Edge <= 15'],
    browsers: ['> 1%', 'last 2 versions'],
}
// TODO: colorblind config

module.exports = {
    ident: 'postcss',
    plugins: [
        // Rework css to simulate colorblindness.
        // https://github.com/btholt/postcss-colorblind
        // require('postcss-colorblind')(),
        // Import from local files, node modules or web_modules.
        // https://github.com/postcss/postcss-import
        require('postcss-import')({
            path: [paths.srcShared],
        }),
        // This project tries to fix all of flexbug's issues.
        // https://github.com/philipwalton/flexbugs
        require('postcss-flexbugs-fixes')(),
        require('autoprefixer')(browsers),
        // Customizes normalize.css to your browserslist.
        // https://github.com/csstools/postcss-normalize
        require('postcss-normalize')(browsers),
        // Report breaking browser compatibility from caniuse
        // https://github.com/anandthakker/doiuse
        // require('doiuse')({
        //     ...browsers,
        //     onFeatureUsage: ({message}) => console.error(message),
        // }),
    ],
    // TODO: This doesn't appear to be respected. Check that.
    sourceMap: true,

    syntax: require.resolve('postcss-less'),
}
