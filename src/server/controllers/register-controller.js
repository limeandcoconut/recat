import argon2 from 'argon2'
// import crypto from 'crypto'
// import jwt from 'jsonwebtoken'
// import db from '../models/db.js'
import Sequelize from 'sequelize'
// import {setAsync, getAsync} from '../models/redis.js'
import User from '../models/user.js'
// import Player from '../models/player.js'
// import {jwtSecret} from '../../keys.js'
/* eslint-disable require-jsdoc */

export async function register(user) {
    // TODO not a terribly good password strength test
    // TODO Typrography enforcement
    const passwordRequirements = new RegExp('(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])')
    if (!user.password) {
        return {success: false, error: 'empty password'}
    } else if (user.password.length < 8) {
        return {success: false, error: 'password too short'}
    } else if (user.password.length >= 128) {
        return {success: false, error: 'password too long'}
    } else if (!passwordRequirements.test(user.password)) {
        return {success: false, error: 'weak password'}
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
                return {success: false, error: 'unique validation error'}
            }

            return {success: false, error: 'validation error'}
        } else if (err instanceof Sequelize.ForeignKeyConstraintError) {
            // At the moment, I don't know how to trigger one of these
            return {success: false, error: 'foreign key constrain error'}
        }

        if (process.env.NODE_ENV === 'development') {
            console.error(err)
        }
        return {success: false, error: 'Unkown'}
    }

    return {success: true}

}

// signed cookies

// gen session id
// redis table save session ass with user id
// default redis cli ex
// redis key value uid

// async function login(user) {
//     let {email, password} = user
//     let existingUser = await User.findOne({
//         where: {
//             email,
//         },
//         include: [Player],
//     })

//     if (!existingUser) {
//         return {success: false, error: 'invalid username or password'}
//     }

//     let isValidPassword = await argon2.verify(existingUser.passwordHash, password)
//     if (isValidPassword) {
//         const token = jwt.sign({
//             userId: existingUser.id,
//             exp: Math.floor(Date.now() / 1000) + (60 * 60), // Signin is valid for 1 hour
//         }, jwtSecret)
//         return {success: true, token, players: existingUser.players}
//     }

//     return {success: false, error: 'invalid username or password'}
// }

// async function authorize(token) {
//     let res = await getAsync(token)
//     if (res) {
//         return {success: true}
//     }

//     return {success: false}
// }
