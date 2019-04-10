module.exports = (env = 'production') => {
    process.env.MUTE_PACK = process.env.MUTE_PACK === 'true' || process.env.MUTE_PACK === true
    if (env === 'development' || env === 'dev') {
        process.env.NODE_ENV = 'development'
        return [require('./client.dev'), require('./server.dev')]
    }
    process.env.NODE_ENV = 'production'
    return [require('./client.prod'), require('./server.prod')]
}
