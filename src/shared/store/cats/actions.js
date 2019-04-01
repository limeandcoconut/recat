import ReactGA from 'react-ga'

export const requestCat = () => ({
    type: 'CATS/REQUEST_CAT',
    payload: {requested: true},
})

export const succeedCat = (image) => {
    ReactGA.event({
        category: 'Cat',
        action: 'View',
    })
    return {
        type: 'CATS/FETCH_SUCCESS',
        payload: {
            requested: false,
            image,
        },
    }
}

export const failCat = (error) => ({
    type: 'CATS/FETCH_FAILURE',
    payload: {
        requested: false,
        image: null,
        // TODO: Grumpycat
        error: error || 'UNKNOWN ERROR FETCHING CAT',
    },
})
