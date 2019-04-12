import ReactGA from 'react-ga'

/**
 * Action creator
 * @function requestLogout
 * @return {object} An object with type and a payload of state to alter.
 */
export const requestLogout = () => ({
    type: 'LOGOUT/REQUEST_LOGOUT',
    payload: {
        requested: true,
    },
})

/**
 * Action creator
 * @function succeedLogout
 * @return {object} An object with type and a payload of state to alter.
 */
export const succeedLogout = () => {
    ReactGA.event({
        category: 'User',
        action: 'Logout',
    })
    return {
        type: 'LOGOUT/LOGOUT_SUCCESS',
        payload: {
            success: true,
            requested: false,
        },
    }
}

/**
 * Action creator
 * @function failLogout
 * @param {string} error An error message to display.
 * @return {object} An object with type and a payload of state to alter.
 */
export const failLogout = (error) => ({
    type: 'LOGOUT/LOGOUT_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING LOGOUT',
    },
})
