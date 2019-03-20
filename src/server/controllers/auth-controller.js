import argon2 from 'argon2'
import {setAsync, getAsync} from '../models/redis'
// import crypto from 'crypto'
// import jwt from 'jsonwebtoken'
// import db from '../models/db.js'
import Sequelize from 'sequelize'
// import {setAsync, getAsync} from '../models/redis.js'
import User from '../models/user.js'
import {encrypt, decrypt, randomId} from '../../shared/utils.js'
// import Player from '../models/player.js'
import {encryptionKey} from '../../../keys.js'
/* eslint-disable require-jsdoc */

export async function register(user) {
    // TODO not a terribly good password strength test
    // TODO Typrography enforcement
    const passwordRequirements = new RegExp('(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])')
    if (!user.password) {
        return {response: {success: false, error: 'empty password'}}
    } else if (user.password.length < 8) {
        return {response: {success: false, error: 'password too short'}}
    } else if (user.password.length >= 128) {
        return {response: {success: false, error: 'password too long'}}
    } else if (!passwordRequirements.test(user.password)) {
        return {response: {success: false, error: 'weak password'}}
    }
    console.log(user)

    const passwordHash = await argon2.hash(user.password)
    try {
        await User.create({
            email: user.email,
            passwordHash,
        })
    } catch (err) {
        // joi validation
        if (err instanceof Sequelize.ValidationError) {
            if (err.errors[0].type === 'unique violation') {
                return {response: {success: false, error: 'unique validation error'}}
            }

            return {response: {success: false, error: 'validation error'}}
        } else if (err instanceof Sequelize.ForeignKeyConstraintError) {
            // At the moment, I don't know how to trigger one of these
            return {response: {success: false, error: 'foreign key constrain error'}}
        }

        if (process.env.NODE_ENV === 'development') {
            console.error(err)
        }
        return {response: {success: false, error: 'Unkown'}}
    }

    return {response: {success: true}}

}

// signed cookies

// gen session id
// redis table save session ass with user id
// default redis cli ex
// redis key value uid

export async function login(user) {
    let {email, password} = user

    let existingUser = await User.findOne({
        where: {
            email,
        },
    })

    if (!existingUser) {
        return {response: {success: false, error: 'invalid username or password'}}
    }

    let isValidPassword = await argon2.verify(existingUser.passwordHash, password)

    if (!isValidPassword) {
        return {response: {success: false, error: 'invalid username or password'}}
    }

    const sessionId = randomId()
    const maxAge = 60 * 60

    try {
        await setAsync(sessionId, existingUser.id, 'EX', maxAge)
    } catch (error) {
        return {response: {success: false, error: 'internal error'}}
    }

    const encryptedSession = encrypt(sessionId, encryptionKey)

    // TODO: add prod stuff
    let domain
    let secure
    if (false) {
        domain = 'Domain=localhost;'
        secure = 'Secure;'
    }

    const cookie = `session=${encryptedSession}; Max-Age=${maxAge}; HttpOnly; SameSite=strict; ${domain} ${secure}`

    return {response: {success: true}, cookie}
}

export async function checkAuth(encryptedSession) {
    let sessionId
    try {
        sessionId = decrypt(encryptedSession, encryptionKey)
    } catch (error) {
        return {response: {success: false, error: 'internal error'}}
    }

    let userId
    try {
        userId = await getAsync(sessionId)
    } catch (error) {
        return {response: {success: false, error: 'internal error'}}
    }

    if (!userId) {
        return {response: {success: false, error: 'not authorized'}}
    }

    return {response: {success: true}}
}
