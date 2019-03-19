export const updateRegistration = ({name, value}) => ({
    type: 'REGISTRATION/UPDATE_FORM',
    payload: {
        name,
        value,
    },
})

export const requestRegistration = () => ({
    type: 'REGISTRATION/REQUEST_REGISTRATION',
    payload: {
        requested: true,
    },
})

export const succeedRegistration = () => ({
    type: 'REGISTRATION/REGISTRATION_SUCCESS',
    payload: {
        success: true,
        requested: false,
    },
})

export const failRegistration = (error) => ({
    type: 'REGISTRATION/REGISTRATION_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING REGISTRATION',
    },
})

// export const toggleLogin = () => {
//     console.log('foo')
//     return {
//         type: 'AUTH/TOGGLE_LOGIN',
//         payload: {},
//     }
// }
