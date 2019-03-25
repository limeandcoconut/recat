import {produce} from 'immer'

export const initialState = Object.freeze({
    success: false,
    requested: false,
    error: null,
    form: {
        username: '',
        email: '',
        password: '',
    },
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {requested, success, error, name, value} = {}} = action
        switch (type) {
        case 'REGISTRATION/UPDATE_FORM':
            draft.form[name] = value
            break
        case 'REGISTRATION/REQUEST_REGISTRATION':
            draft.requested = requested
            draft.error = null
            break
        case 'REGISTRATION/REGISTRATION_SUCCESS':
            draft.requested = requested
            draft.success = success
            draft.error = null
            break
        case 'REGISTRATION/REGISTRATION_FAILURE':
            draft.requested = requested
            draft.success = success
            draft.error = error
            break
        default:
            // Handled by immer. yay :D :3
        }
    })
