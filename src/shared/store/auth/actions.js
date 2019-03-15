export const updateRegistration = (formUpdate) => ({
    type: 'AUTH/UPDATE_FORM',
    payload: {
        formUpdate,
    },
})

export const requestRegistration = () => ({
    type: 'AUTH/REQUEST_REGISTRATION',
    payload: {
        requested: true,
    },
})

export const succeedRegistration = () => ({
    type: 'AUTH/REGISTRATION_SUCCESS',
    payload: {
        success: true,
        requested: false,
    },
})

export const failRegistration = (error) => ({
    type: 'AUTH/REGISTRATION_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING REGISTRATION',
    },
})

export const toggleLogin = () => {
    console.log('foo')
    return {
        type: 'AUTH/TOGGLE_LOGIN',
        payload: {},
    }
}
