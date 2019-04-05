import ReactGA from 'react-ga'

/**
 * Action creator
 * @function requestCat
 * @return {object} An object with type and a payload of state to alter.
 */
export const requestCat = () => ({
    type: 'CATS/REQUEST_CAT',
    payload: {
        requested: true,
    },
})

/**
 * Action creator
 * Creates a google analytics event.
 * @function succeedCat
 * @param {object} image A blob to use as the image source.
 * @param {string} id A filename for the provided blob. This can be used to favorite this image on the server.
 * @return {object} An object with type and a payload of state to alter.
 */
export const succeedCat = (image, id) => {
    ReactGA.event({
        category: 'Cat',
        action: 'View',
    })
    return {
        type: 'CATS/FETCH_SUCCESS',
        payload: {
            requested: false,
            image,
            id,
        },
    }
}

/**
 * Action creator
 * @function failCat
 * @param {string} error An error message to provide the user.
 * @return {object} An object with type and a payload of state to alter.
 */
export const failCat = (error) => ({
    type: 'CATS/FETCH_FAILURE',
    payload: {
        requested: false,
        image: null,
        id: null,
        // TODO: Grumpycat
        error: error || 'UNKNOWN ERROR FETCHING CAT',
    },
})
