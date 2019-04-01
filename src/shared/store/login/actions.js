import ReactGA from 'react-ga'

export const updateLogin = ({name, value}) => ({
    type: 'LOGIN/UPDATE_FORM',
    payload: {
        name,
        value,
    },
})

export const requestLogin = () => ({
    type: 'LOGIN/REQUEST_LOGIN',
    payload: {
        requested: true,
    },
})

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

export const failLogin = (error) => ({
    type: 'LOGIN/LOGIN_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING LOGIN',
    },
})

