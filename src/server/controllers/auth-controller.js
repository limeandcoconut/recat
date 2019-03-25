import argon2 from 'argon2'
import {setAsync, getAsync, delAsync} from '../models/redis'
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
    await new Promise((resolve) => setTimeout(resolve, 2000))
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

    const passwordHash = await argon2.hash(user.password)
    try {
        await User.create({
            email: user.email,
            passwordHash,
        })
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            if (error.errors[0].type === 'unique violation') {
                return {response: {success: false, error: 'you\'re already registered'}}
            }

            return {response: {success: false, error: 'unacceptable email'}}
        } else if (error instanceof Sequelize.ForeignKeyConstraintError) {
            return {response: {success: false, error: 'internal error'}}
        }

        return {response: {success: false, error: 'internal error'}}
    }

    return {response: {success: true}}

}

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

export async function logout(encryptedSession) {

    let sessionId
    try {
        sessionId = decrypt(encryptedSession, encryptionKey)
    } catch (error) {
        return {response: {success: false, error: 'internal error'}}
    }

    try {
        await delAsync(sessionId)
    } catch (error) {
        // TODO: Logging here?
    }

    // TODO: add prod stuff
    let domain
    let secure
    if (false) {
        domain = 'Domain=localhost;'
        secure = 'Secure;'
    }

    const cookie = `session=; Max-Age=0; HttpOnly; SameSite=strict; ${domain} ${secure}`

    return {response: {success: true}, cookie}
}

