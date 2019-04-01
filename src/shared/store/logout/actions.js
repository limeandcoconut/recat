import ReactGA from 'react-ga'

export const requestLogout = () => ({
    type: 'LOGOUT/REQUEST_LOGOUT',
    payload: {
        requested: true,
    },
})

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

export const failLogout = (error) => ({
    type: 'LOGOUT/LOGOUT_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING LOGOUT',
    },
})
// TODO: FIX AUTH STATE TO MATCH DIAGRAM
