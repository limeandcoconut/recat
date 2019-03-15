const Sequelize = require('sequelize')
const {dbUsername, dbPassword, dbName} = require('../../../keys.js')

// console.log(keys)
console.log(dbUsername, dbPassword)

const db = new Sequelize({
    dialect: 'postgres',
    database: dbName,
    username: dbUsername,
    host: 'localhost',
    port: '5432',
    password: dbPassword,
    logging: false,
})

module.exports = db
