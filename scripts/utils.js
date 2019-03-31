// const chalk = require('chalk')
// const logger = require('../src/shared/logging/logger')

// const logMessage = (message, level = 'info') => {
//     const color = level === 'error' ? 'red' : level === 'warning' ? 'yellow' : 'white'
//     console.log(`[${new Date().toISOString()}]`, chalk[color](message))
// }

const compilerPromise = (name, compiler) => {
    return new Promise((resolve, reject) => {
        compiler.hooks.compile.tap(name, () => {
            console.log(`[${name}] Compiling `)
        })
        compiler.hooks.done.tap(name, (stats) => {
            if (!stats.hasErrors()) {
                return resolve()
            }
            return reject(`Failed to compile ${name}`)
        })
    })
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const clientOnly = () => process.argv.includes('--client-only')

module.exports = {
    clientOnly,
    compilerPromise,
    // logMessage,
    sleep,
}
