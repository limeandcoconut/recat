const paths = require('../paths')
const path = require('path')

module.exports = {
    extensions: ['.js', '.mjs', '.json', '.jsx', '.css', '.less'],
    modules: paths.resolveModules,
    alias: {
        // TODO: Figure out why this is broken and start using it
        // For less
        '@assets': path.resolve(__dirname, 'src/shared/assets/'),
    },
}
