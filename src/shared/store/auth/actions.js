export const requestAuth = () => ({
    type: 'AUTH/REQUEST_AUTH',
    payload: {
        requested: true,
    },
})

export const succeedAuth = () => ({
    type: 'AUTH/AUTH_SUCCESS',
    payload: {
        success: true,
        requested: false,
    },
})

export const failAuth = (error) => ({
    type: 'AUTH/AUTH_FAILURE',
    payload: {
        success: false,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING AUTH',
    },
})
