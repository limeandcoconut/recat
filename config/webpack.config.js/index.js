module.exports = () => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
        return [require('./client.dev'), require('./server.dev')]
    }
    return [require('./client.prod'), require('./server.prod')]
}
