/**
 * Get a promise that reolves when the given complier completes. Plus logging.
 * @function compilerPromise
 * @param  {string} name     The name of the complier.
 * @param  {object} compiler The webpack compiler to wait for.
 * @return {promise}  A promise that reolves when the given complier completes.
 */
const compilerPromise = (name, compiler) => {
    return new Promise((resolve, reject) => {
        compiler.hooks.compile.tap(name, () => {
            console.log(`[${name}] Compiling `)
        })
        compiler.hooks.done.tap(name, (stats) => {
            if (!stats.hasErrors()) {
                return resolve()
            }
            console.log(stats.compilation.errors)
            return reject(`Failed to compile ${name}`)
        })
    })
}

/**
 * Provides a promise which resolves in the given number of ms.
 * @function sleep
 * @param  {number} ms Number of ms to wait before resolving
 * @return {promise} A promise which resolves after the wait period.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = {
    compilerPromise,
    sleep,
}
