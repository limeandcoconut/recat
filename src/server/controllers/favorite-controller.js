import Sequelize from 'sequelize'
import User from '../models/user.js'
import filenamify from 'filenamify'
import logger from '../../shared/logging/logger'
import path from 'path'
import fs from 'fs'
import {swapForBrotliPath} from './img-controller'
/* eslint-disable require-jsdoc */

/**
 * @function setFavorite
 * @param  {string} favorite The file name of the image to favorite
 * @param  {string} userId Postgres User Id
 * @return {Object} An object containing a response: success flag, and: an error or a favorite image name.
 */
export async function setFavorite(favorite, userId) {
    let sanitizedFavorite
    try {
        sanitizedFavorite = filenamify(favorite)
    } catch (error) {
        logger.warn(error, userId, favorite)
        return {response: {success: false, error: 'invalid file id'}}
    }

    if (favorite !== sanitizedFavorite) {
        // Something suspect has happened here. The user might have tried to send something malicious.
        return {response: {success: false, error: 'invalid file id'}}
    }

    if (favorite !== path.basename(sanitizedFavorite)) {
        // Something suspect has happened here. The user might have tried to send something malicious.
        return {response: {success: false, error: 'invalid file id'}}
    }

    // Convert to brotli name. A .br exists because images are optomistically selected from the list of completed
    // brotlis when user request one.
    sanitizedFavorite = swapForBrotliPath(sanitizedFavorite)

    if (!fs.existsSync(sanitizedFavorite)) {
        // Something suspect has happened here. The user might have tried to send something malicious.
        return {response: {success: false, error: 'invalid file id'}}
    }

    try {
        await User.update({
            favorite: sanitizedFavorite,
        }, {
            where: {
                id: userId,
            },
        })
    } catch (error) {
        logger.error(error)
        if (error instanceof Sequelize.ValidationError) {
            if (error.errors[0].type === 'unique violation') {
                return {response: {success: false, error: 'wat'}}
            }

            return {response: {success: false, error: 'wat'}}
        } else if (error instanceof Sequelize.ForeignKeyConstraintError) {
            return {response: {success: false, error: 'internal error'}}
        }

        return {response: {success: false, error: 'internal error'}}
    }
    return {response: {success: true, favorite: favorite}}
}

/**
 * @function getFavorite
 * @param  {string} userId Postgres User Id
 * @return {Object} An object containing a response: success flag, and: an error or a favorite image name.
 */
export async function getFavorite(userId) {

    const user = await User.findOne({
        where: {
            id: userId,
        },
    })

    if (!user) {
        return {response: {success: false, error: 'No favorite set'}}
    }

    const {favorite} = user
    if (!favorite) {
        return {response: {success: false, error: 'No favorite set'}}
    }

    return {response: {success: true, favorite}}
}

