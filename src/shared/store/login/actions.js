import ReactGA from 'react-ga'

/**
 * Action creator
 * @function updateLogin
 * @param {object} formUpdate An object with two properties, name being an input name, and value being the value of that
 *                            input.
 * @return {object} An object with type and a payload of state to alter.
 */
export const updateLogin = ({name, value}) => ({
    type: 'LOGIN/UPDATE_FORM',
    payload: {
        name,
        value,
    },
})

/**
 * Action creator
 * @function requestLogin
 * @return {object} An object with type and a payload of state to alter.
 */
export const requestLogin = () => ({
    type: 'LOGIN/REQUEST_LOGIN',
    payload: {
        requested: true,
    },
})

/**
 * Action creator
 * Creates a google analytics event.
 * @function succeedLogin
 * @return {object} An object with type and a payload of state to alter.
 */
export const succeedLogin = () => {
    ReactGA.event({
        category: 'User',
        action: 'Login',
    })
    return {
        type: 'LOGIN/LOGIN_SUCCESS',
        payload: {
            success: true,
            requested: false,
        },
    }
}

/**
 * Action creator
 * @function failLogin
 * @param {string} error An error message to display.
 * @return {object} An object with type and a payload of state to alter.
 */
export const failLogin = (error) => ({
    type: 'LOGIN/LOGIN_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING LOGIN',
    },
})

