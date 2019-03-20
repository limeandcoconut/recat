export const requestCat = () => ({
    type: 'CATS/REQUEST_CAT',
    payload: {requested: true},
})

export const succeedCat = (src) => ({
    type: 'CATS/FETCH_SUCCESS',
    payload: {
        requested: false,
        src,
    },
})

export const failCat = (error) => ({
    type: 'CATS/FETCH_FAILURE',
    payload: {
        requested: false,
        src: null,
        // TODO: Grumpycat
        error: error || 'UNKNOWN ERROR FETCHING CAT',
    },
})
