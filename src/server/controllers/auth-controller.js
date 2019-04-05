import argon2 from 'argon2'
import {setAsync, getAsync, delAsync} from '../models/redis'
import Sequelize from 'sequelize'
import User from '../models/user.js'
import {encrypt, decrypt, randomId} from '../../shared/utils.js'
import {encryptionKey} from '../../../config/keys.js'
import {productionHost} from '../../../config/config'
import {loggers} from 'winston'

const cookieDomain = productionHost.match(/\/\/(.*)$/)[1]

/**
 * @function register
 * @param  {Object} user Keys: email and password.
 * @return {Object} An object containing a response: success flag, and an error if unsuccessful.
 */
export async function register({email, password}) {
    // TODO Topology enforcement
    const passwordRequirements = new RegExp('(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])')
    if (!password) {
        return {response: {success: false, error: 'empty password'}}
    } else if (password.length < 8) {
        return {response: {success: false, error: 'password too short'}}
    } else if (password.length >= 128) {
        return {response: {success: false, error: 'password too long'}}
    } else if (!passwordRequirements.test(password)) {
        return {response: {success: false, error: 'weak password'}}
    }

    const passwordHash = await argon2.hash(password)
    try {
        await User.create({
            email,
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

/**
 * @function login
 * @param  {Object} user Keys: email and password.
 * @return {Object} An object containing a response: success flag, and an error, and a cookie to set the session if successful.
 */
export async function login(user) {
    const {email, password} = user

    // Get a user
    const existingUser = await User.findOne({
        where: {
            email,
        },
    })

    if (!existingUser) {
        return {response: {success: false, error: 'invalid username or password'}}
    }

    // Validate password
    const {passwordHash, id: userId} = existingUser
    const isValidPassword = await argon2.verify(passwordHash, password)

    if (!isValidPassword) {
        return {response: {success: false, error: 'invalid username or password'}}
    }

    // Set an hour session
    const sessionId = randomId()
    const maxAge = 60 * 60

    try {
        await setAsync(sessionId, userId, 'EX', maxAge)
    } catch (error) {
        return {response: {success: false, error: 'internal error'}}
    }

    // Encrypt the session
    const encryptedSession = encrypt(sessionId, encryptionKey)

    // Create the cookie
    let domain = ''
    let secure = ''
    if (process.env.NODE_ENV === 'production') {
        domain = `Domain=${cookieDomain};`
        secure = 'Secure;'
    }

    const cookie = `session=${encryptedSession}; Max-Age=${maxAge}; ${domain} ${secure} HttpOnly; SameSite=strict; Path=/`
    console.log(cookie)

    return {response: {success: true}, cookie, userId}
}

/**
 * @function authenticate
 * @param  {String} encryptedSession The encrypted session.
 * @return {Object} An object containing a response: success flag, and an error if unsuccessful.
 */
export async function authenticate(encryptedSession) {
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

    return {response: {success: true}, userId}
}

/**
 * @function logout
 * @param  {String} encryptedSession The ecnrypted session.
 * @return {Object} An object containing a response: success flag, and an error, and a cookie to unset the session if successful.
 */
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
        loggers.warn('Error while deleting session.', {error})
    }

    let domain = ''
    let secure = ''
    if (process.env.NODE_ENV === 'production') {
        domain = `Domain=${cookieDomain};`
        secure = 'Secure;'
    }

    const cookie = `session=; Max-Age=0; ${domain} ${secure} HttpOnly; SameSite=strict; Path=/`

    return {response: {success: true}, cookie}
}

