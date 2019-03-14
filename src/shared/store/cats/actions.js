export const requestCat = () => ({
    type: 'CATS/REQUEST_CAT',
    payload: {fetching: true},
})

export const succeedCat = (src) => ({
    type: 'CATS/FETCH_SUCCESS',
    payload: {
        fetching: false,
        src,
    },
})

export const failCat = (error) => ({
    type: 'CATS/FETCH_FAILURE',
    payload: {
        fetching: false,
        src: null,
        // TODO: Grumpycat
        error: error || 'UNKNOWN ERROR FETCHING CAT',
    },
})
