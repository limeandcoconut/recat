import {produce} from 'immer'

export const initialState = Object.freeze({
    favorite: null,
    get: {
        requested: false,
        error: null,
    },
    put: {
        requested: false,
        error: null,
    },
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {requested, favorite, error} = {}} = action
        switch (type) {
        case 'FAVORITE/REQUEST_FAVORITE':
            draft.get.requested = requested
            draft.get.error = null
            break
        case 'FAVORITE/REQUEST_SUCCESS':
            draft.favorite = favorite
            draft.get.requested = requested
            draft.get.error = null
            break
        case 'FAVORITE/REQUEST_FAILURE':
            draft.favorite = favorite
            draft.get.requested = requested
            draft.get.error = error
            break
        case 'FAVORITE/PUT_FAVORITE':
            draft.put.requested = requested
            draft.put.error = null
            break
        case 'FAVORITE/PUT_SUCCESS':
            draft.favorite = favorite
            draft.put.requested = requested
            draft.put.error = null
            break
        case 'FAVORITE/PUT_FAILURE':
            draft.favorite = favorite
            draft.put.requested = requested
            draft.put.error = error
            break
        default:
            // Handled by immer. yay :D :3
        }
    })
