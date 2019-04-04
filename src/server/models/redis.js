import promisify from 'util.promisify'
import redis from 'redis'
const client = redis.createClient()

// String type values
const setAsync = promisify(client.set).bind(client)
const getAsync = promisify(client.get).bind(client)
const delAsync = promisify(client.del).bind(client)

// Lists
const rpushAsync = promisify(client.rpush).bind(client)
const rpopAsync = promisify(client.rpop).bind(client)
const lrangeAsync = promisify(client.lrange).bind(client)

// Other
const expireAsync = promisify(client.expire).bind(client)

export {
    client,
    setAsync,
    getAsync,
    delAsync,
    expireAsync,

    rpushAsync,
    rpopAsync,
    lrangeAsync,
}
