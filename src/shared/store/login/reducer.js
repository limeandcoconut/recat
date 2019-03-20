import {produce} from 'immer'

export const initialState = Object.freeze({
    // registration: {
    success: null,
    requested: false,
    error: null,
    // },
    form: {
        username: '',
        email: '',
        password: '',
    },
    formUpdate: {},
    // showLogin: false,
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {requested, success, error, name, value} = {}} = action
        // const {auth: {form = {}, registration = {}} = {}} = draft
        // console.log(action)
        switch (type) {
        // case 'AUTH/TOGGLE_LOGIN':
        //     draft.showLogin = !draft.showLogin
        //     break
        case 'LOGIN/UPDATE_FORM':
            // draft.form = {
            //     ...draft.form,
            //     [name]: value,
            // }
            // console.log(draft.form)
            draft.form[name] = value
            break
        case 'LOGIN/REQUEST_LOGIN':
            draft.requested = requested
            break
        case 'LOGIN/LOGIN_SUCCESS':
            draft.requested = requested
            draft.success = success
            break
        case 'LOGIN/LOGIN_FAILURE':
            draft.requested = requested
            draft.success = success
            draft.error = error
            break
        default:
            // yay
        }
    })
