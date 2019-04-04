import {produce} from 'immer'

export const initialState = Object.freeze({
    requested: false,
    image: null,
    error: null,
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {image, requested, error, id} = {}} = action
        switch (type) {
        case 'CATS/REQUEST_CAT':
            draft.requested = requested
            draft.error = null
            break
        case 'CATS/FETCH_SUCCESS':
            draft.requested = requested
            draft.image = image
            draft.error = null
            draft.id = id
            break
        case 'CATS/FETCH_FAILURE':
            draft.requested = requested
            draft.image = image
            draft.error = error
            draft.id = id
            break
        default:
            // Handled by immer. yay :D :3
        }
    })
