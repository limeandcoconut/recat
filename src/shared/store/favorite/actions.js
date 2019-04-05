import ReactGA from 'react-ga'

/**
 * Action creator
 * @function requestFavorite
 * @return {object} An object with type and a payload of state to alter.
 */
export const requestFavorite = () => ({
    type: 'FAVORITE/REQUEST_FAVORITE',
    payload: {
        requested: true,
    },
})

/**
 * Action creator
 * @function succeedFavoriteRequest
  * @param {object} favorite A blob to use as the image source.
 * @return {object} An object with type and a payload of state to alter.
 */
export const succeedFavoriteRequest = (favorite) => ({
    type: 'FAVORITE/REQUEST_SUCCESS',
    payload: {
        favorite,
        requested: false,
    },
})

/**
 * Action creator
 * @function succeedFavoriteRequest
 * @param {string} error An error message to provide the user.
 * @return {object} An object with type and a payload of state to alter.
 */
export const failFavoriteRequest = (error) => ({
    type: 'FAVORITE/REQUEST_FAILURE',
    payload: {
        favorite: null,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING FAVORITE REQUEST',
    },
})

/**
 * Action creator
 * @function putFavorite
 * @param {object} favorite A unique identifier (filename) to indicate the favorite image to the server.
 * @return {object} An object with type and a payload of state to alter.
 */
export const putFavorite = (favorite) => ({
    type: 'FAVORITE/PUT_FAVORITE',
    payload: {
        favorite,
        requested: true,
    },
})

/**
 * Action creator
 * Creates a google analytics event.
 * @function succeedFavoritePut
 * @param {object} favorite A blob to use as the image source.
 * @return {object} An object with type and a payload of state to alter.
 */
export const succeedFavoritePut = (favorite) => {
    ReactGA.event({
        category: 'Images',
        action: 'Favorite',
    })
    return {
        type: 'FAVORITE/PUT_SUCCESS',
        payload: {
            favorite,
            requested: false,
        },
    }
}

/**
 * Action creator
 * @function failFavoritePut
 * @param {string} error An error message to provide the user.
 * @return {object} An object with type and a payload of state to alter.
 */
export const failFavoritePut = (error) => ({
    type: 'FAVORITE/PUT_FAILURE',
    payload: {
        favorite: null,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING FAVORITE PUT',
    },
})

// I know what you're thinking. "Didn't you forget the unfavorite functionality?" Well no, you good sir or madam
// are mistaken. Any user story which implies unfavoriting a picture of a kitty cat is blatant poppycock and has
// no place here. I won't stand for it.
// 🧐

