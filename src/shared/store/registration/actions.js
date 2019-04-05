import ReactGA from 'react-ga'

/**
 * Action creator
 * @function updateRegistration
 * @param {object} formUpdate An object with two properties, name being an input name, and value being the value of that
 *                            input.
 * @return {object} An object with type and a payload of state to alter.
 */
export const updateRegistration = ({name, value}) => ({
    type: 'REGISTRATION/UPDATE_FORM',
    payload: {
        name,
        value,
    },
})

/**
 * Action creator
 * @function resetRegistration
 * @return {object} An object with type and a payload of state to alter.
 */
export const requestRegistration = () => ({
    type: 'REGISTRATION/REQUEST_REGISTRATION',
    payload: {
        requested: true,
    },
})

/**
 * Action creator
 * Creates a google analytics event.
 * @function succeedRegistration
 * @return {object} An object with type and a payload of state to alter.
 */
export const succeedRegistration = () => {
    ReactGA.event({
        category: 'User',
        action: 'Registered',
    })
    return {
        type: 'REGISTRATION/REGISTRATION_SUCCESS',
        payload: {
            success: true,
            requested: false,
        },
    }
}

/**
 * Action creator
 * @function failRegistration
 * @param {string} error An error message to display.
 * @return {object} An object with type and a payload of state to alter.
 */
export const failRegistration = (error) => ({
    type: 'REGISTRATION/REGISTRATION_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING REGISTRATION',
    },
})

/**
 * Action creator
 * @function resetRegistration
 * @return {object} An object with type and a payload of state to alter.
 */
export const resetRegistration = () => ({
    type: 'REGISTRATION/REGISTRATION_RESET',
    payload: {
        success: false,
        requested: false,
        error: null,
    },
})
