import ReactGA from 'react-ga'

export const requestFavorite = () => ({
    type: 'FAVORITE/REQUEST_FAVORITE',
    payload: {
        requested: true,
    },
})

export const succeedFavoriteRequest = (favorite) => ({
    type: 'FAVORITE/REQUEST_SUCCESS',
    payload: {
        favorite,
        requested: false,
    },
})

export const failFavoriteRequest = (error) => ({
    type: 'FAVORITE/REQUEST_FAILURE',
    payload: {
        favorite: null,
        requested: false,
        error: error || 'UNKNOWN ERROR DURING FAVORITE REQUEST',
    },
})

export const putFavorite = (favorite) => ({
    type: 'FAVORITE/PUT_FAVORITE',
    payload: {
        favorite,
        requested: true,
    },
})

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

