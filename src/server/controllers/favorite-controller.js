import Sequelize from 'sequelize'
import User from '../models/user.js'
import filenamify from 'filenamify'
import logger from '../../shared/logging/logger'
import path from 'path'
import fs from 'fs'
import {swapForBrotliPath} from './img-controller'

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
        logger.warn({error, userId, favorite})
        return {response: {success: false, error: 'invalid file id'}}
    }

    if (favorite !== sanitizedFavorite) {
        // Something suspect might have happened here.
        return {response: {success: false, error: 'invalid file id'}}
    }

    if (favorite !== path.basename(sanitizedFavorite)) {
        return {response: {success: false, error: 'invalid file id'}}
    }

    // Convert to brotli name. A .br exists because images are optomistically selected from the list of completed
    // brotlis when user request one.
    sanitizedFavorite = swapForBrotliPath(sanitizedFavorite)

    if (!fs.existsSync(sanitizedFavorite)) {
        return {response: {success: false, error: 'invalid file id'}}
    }

    // Save to postgres
    try {
        await User.update({
            favorite: sanitizedFavorite,
        }, {
            where: {
                id: userId,
            },
        })
    } catch (error) {
        logger.error({error})
        if (error instanceof Sequelize.ForeignKeyConstraintError) {
            return {response: {success: false, error: 'internal error'}}
        }

        return {response: {success: false, error: 'internal error'}}
    }
    // Respond with the provided id (which hasn't been altered)
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
        return {response: {success: false, error: 'no favorite set'}}
    }

    const {favorite} = user
    if (!favorite) {
        return {response: {success: false, error: 'no favorite set'}}
    }

    // Important difference between this response and the one from setFavorite:
    // Anything returned in the response object should be safe to send to the client.
    // This is but the intent is no to send it.
    return {response: {success: true}, favorite}
}

