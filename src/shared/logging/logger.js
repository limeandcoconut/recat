const {createLogger, transports, format} = require('winston')
const paths = require('../../../config/paths')
const path = require('path')

const logger = createLogger({
    level: 'silly',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({stack: true}),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.File({filename: path.resolve(paths.logging, 'bad.log'), level: 'warn', handleExceptions: true}),
        new transports.File({filename: path.resolve(paths.logging, 'all.log'), level: 'silly', handleExceptions: true}),
    ],
    exitOnError: false,
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
    }))
}

module.exports = logger
