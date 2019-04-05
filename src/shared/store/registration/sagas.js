import {takeLatest, call, put, select, all} from 'redux-saga/effects'
import {succeedRegistration, failRegistration} from './actions.js'
import {showToast, hideToast} from '../toast/actions'
/* eslint-disable valid-jsdoc */

/**
 * A generator to pass along control when an action is fired.
 * @function * watcherSaga
 * @return {undefined}
 */
export default function * watcherSaga() {
    yield takeLatest('REGISTRATION/REQUEST_REGISTRATION', workerSaga)
}

/**
 * @function registerForm
 * @param  {object} state The application store.
 * @return {object} A form object.
 */
const registerForm = (state) => {
    return state.registration.form
}

/**
 * The generator that handles api calls and dispatching responses to the store.
 * @function * workerSaga
 * @return {undefined}
 */
function * workerSaga() {
    const form = yield select(registerForm)
    try {
        const {success, error} = yield call(makeRegisterRequest(form))

        if (!success) {
            yield all([
                put(failRegistration(error)),
                put(showToast({message: error, style: 'error'})),
            ])
            return
        }
        yield all([
            put(succeedRegistration(error)),
            put(hideToast()),
        ])
    } catch (error) {
        yield all([
            put(failRegistration(error)),
            put(showToast({message: error, style: 'error'})),
        ])
    }
}

/**
 * Make a request to the api.
 * @function makeRegisterRequest
 * @param  {object} form A for object to validate.
 * @return {async function} An async function which resolves when it has parsed the server's json response.
 */
function makeRegisterRequest(form) {
    return async () => {
        const response = await fetch(`/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })

        return await response.json()
    }
}

