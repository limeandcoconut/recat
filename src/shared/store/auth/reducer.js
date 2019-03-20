import {produce} from 'immer'

export const initialState = Object.freeze({
    success: null,
    requested: false,
    error: null,
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {requested, success, error} = {}} = action
        switch (type) {
        case 'AUTH/REQUEST_AUTH':
            draft.requested = requested
            break
        case 'AUTH/AUTH_SUCCESS':
            draft.requested = requested
            draft.success = success
            draft.error = null
            break
        case 'AUTH/AUTH_FAILURE':
            draft.requested = requested
            draft.success = success
            draft.error = error
            break
        default:
            // yay
        }
    })
