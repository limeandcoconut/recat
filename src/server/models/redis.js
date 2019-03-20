
import promisify from 'util.promisify'
import redis from 'redis'
let client = redis.createClient()

// String type values
const setAsync = promisify(client.set).bind(client)
const getAsync = promisify(client.get).bind(client)
const delAsync = promisify(client.del).bind(client)

// Hash type values
// const hSetAsync = promisify(client.hset).bind(client)
// const hDelAsync = promisify(client.hdel).bind(client)
// const hmSetAsync = promisify(client.hmset).bind(client)

// Other
const expireAsync = promisify(client.expire).bind(client)

export {
    client,
    setAsync,
    getAsync,
    delAsync,
    // hSetAsync,
    // hDelAsync,
    // hmSetAsync,
    expireAsync,
}
