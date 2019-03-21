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
        case 'LOGOUT/REQUEST_LOGOUT':
            draft.requested = requested
            break
        case 'LOGOUT/LOGOUT_SUCCESS':
            draft.requested = requested
            draft.success = success
            draft.error = null
            break
        case 'LOGOUT/LOGOUT_FAILURE':
            draft.requested = requested
            draft.success = success
            draft.error = error
            break
        default:
            // yay
        }
    })
