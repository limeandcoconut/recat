import {produce} from 'immer'

export const initialState = Object.freeze({
    fetching: false,
    src: null,
    error: null,
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {src, fetching, error} = {}} = action
        switch (type) {
        case 'CATS/REQUEST_CAT':
            draft.fetching = fetching
            break
        case 'CATS/FETCH_SUCCESS':
            draft.fetching = fetching
            draft.src = src
            break
        case 'CATS/FETCH_FAILURE':
            draft.fetching = fetching
            draft.src = src
            draft.error = error
            break
        default:
            // yay
        }
    })
