const logger = require('./logger')

const options = {
    from: new Date() - (24 * 60 * 60 * 1000),
    until: new Date(),
    limit: 10,
    start: 0,
    order: 'desc',
    fields: ['message'],
}

logger.query(options, function(error, results) {
    if (error) {
        /* TODO: handle me */
        throw error
    }

    console.log(results)
})
