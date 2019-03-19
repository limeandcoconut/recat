import {produce} from 'immer'

export const initialState = Object.freeze({
    registration: {
        success: false,
        requested: false,
        error: null,
    },
    form: {
        username: '',
        email: '',
        password: '',
    },
    formUpdate: {},
    showLogin: false,
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {requested, success, error, formUpdate: {name, value} = {}} = {}} = action
        // const {auth: {form = {}, registration = {}} = {}} = draft
        // console.log(action)
        switch (type) {
        case 'AUTH/TOGGLE_LOGIN':
            draft.showLogin = !draft.showLogin
            break
        case 'AUTH/UPDATE_FORM':
            // draft.form = {
            //     ...draft.form,
            //     [name]: value,
            // }
            // console.log(draft.form)
            draft.form[name] = value
            break
        case 'AUTH/REQUEST_REGISTRATION':
            draft.registration.requested = requested
            break
        case 'AUTH/REGISTRATION_SUCCESS':
            draft.registration.requested = requested
            draft.registration.success = success
            break
        case 'AUTH/REGISTRATION_FAILURE':
            draft.registration.requested = requested
            draft.registration.success = success
            draft.registration.error = error
            break
        default:
            // yay
        }
    })
