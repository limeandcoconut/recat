import {produce} from 'immer'

export const initialState = Object.freeze({
    success: false,
    requested: false,
    error: null,
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {requested, success, error} = {}} = action
        switch (type) {
        case 'AUTH/REQUEST_AUTH':
            draft.requested = requested
            draft.error = null
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
            // Handled by immer. yay :D :3
        }
    })
