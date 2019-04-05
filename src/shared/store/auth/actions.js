/**
 * Action creator
 * @function requestAuth
 * @return {object} An object with type and a payload of state to alter.
 */
export const requestAuth = () => ({
    type: 'AUTH/REQUEST_AUTH',
    payload: {
        requested: true,
    },
})

/**
 * Action creator
 * @function succeedAuth
 * @return {object} An object with type and a payload of state to alter.
 */
export const succeedAuth = () => ({
    type: 'AUTH/AUTH_SUCCESS',
    payload: {
        success: true,
        requested: false,
    },
})

/**
 * Action creator
 * @function failAuth
 * @param {string} error An error message to provide the user.
 * @return {object} An object with type and a payload of state to alter.
 */
export const failAuth = (error) => ({
    type: 'AUTH/AUTH_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING AUTH',
    },
})
