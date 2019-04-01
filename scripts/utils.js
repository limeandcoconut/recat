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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const clientOnly = () => process.argv.includes('--client-only')

module.exports = {
    clientOnly,
    compilerPromise,
    sleep,
}
