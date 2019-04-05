import {takeLatest, call, put, select, all} from 'redux-saga/effects'
import {succeedLogin, failLogin} from './actions'
import {succeedAuth, failAuth} from '../auth/actions'
import {showToast, hideToast} from '../toast/actions'
import {requestFavorite} from '../favorite/actions'
import {requestCat} from '../cats/actions'

/**
  * A generator to pass along control when an action is fired.
  * @generator
  * @function watcherSaga
  * @return {undefined}
  */
export default function * watcherSaga() {
    yield takeLatest('LOGIN/REQUEST_LOGIN', workerSaga)
}

/**
 * @function loginForm
 * @param  {object} state The application store.
 * @return {object} A form object.
 */
const loginForm = (state) => {
    return state.login.form
}

/**
 * The generator that handles api calls and dispatching responses to the store.
 * @generator
 * @function workerSaga
 * @return {undefined}
 */
function * workerSaga() {
    const form = yield select(loginForm)
    try {
        const {success, error} = yield call(makeLoginRequest(form))

        if (!success) {
            yield all([
                put(failLogin(error)),
                put(failAuth(error)),
                put(showToast({message: error, style: 'error'})),
            ])
            return
        }
        yield all([
            put(succeedLogin()),
            put(succeedAuth()),
            put(hideToast()),
            put(requestFavorite()),
            put(requestCat()),
        ])
    } catch (error) {
        yield all([
            put(failLogin(error)),
            put(failAuth(error)),
            put(showToast({message: error, style: 'error'})),
        ])
    }
}

/**
 * Make a request to the api.
 * @function makeLoginRequest
 * @param  {object} form A for object to validate.
 * @return {async-function} An async function which resolves when it has parsed the server's json response.
 */
function makeLoginRequest(form) {
    return async () => {
        const response = await fetch(`/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })

        return await response.json()
    }
}

