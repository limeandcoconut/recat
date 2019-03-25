import {produce} from 'immer'

export const initialState = Object.freeze({
    requested: false,
    src: null,
    error: null,
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {src, requested, error} = {}} = action
        switch (type) {
        case 'CATS/REQUEST_CAT':
            draft.requested = requested
            draft.error = null
            break
        case 'CATS/FETCH_SUCCESS':
            draft.requested = requested
            draft.src = src
            draft.error = null
            break
        case 'CATS/FETCH_FAILURE':
            draft.requested = requested
            draft.src = src
            draft.error = error
            break
        default:
            // Handled by immer. yay :D :3
        }
    })
