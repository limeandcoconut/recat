import {takeLatest, call, put, all} from 'redux-saga/effects'
import {succeedAuth, failAuth} from './actions.js'
import {showToast, hideToast} from '../toast/actions'

/**
 * A generator to pass along control when an action is fired.
 * @generator
 * @function watcherSaga
 * @return {undefined}
 */
export default function * watcherSaga() {
    yield takeLatest('AUTH/REQUEST_AUTH', workerSaga)
}

/**
 * The generator that handles api calls and dispatching responses to the store.
 * @generator
 * @function workerSaga
 * @return {undefined}
 */
function * workerSaga() {
    try {
        const {success, error} = yield call(makeAuthRequest)

        if (!success) {
            yield all([
                put(failAuth(error)),
                put(showToast({message: error, style: 'error'})),
            ])
            return
        }
        yield all([
            put(succeedAuth(error)),
            put(hideToast()),
        ])
    } catch (error) {
        yield all([
            put(failAuth(error)),
            put(showToast({message: error, style: 'error'})),
        ])
    }
}

/**
 * Make a request to the api.
 * @function makeAuthRequest
 * @return {object} An object with success and errors from the server.
 */
async function makeAuthRequest() {
    const response = await fetch(`/auth/check`, {
        method: 'POST',
    })

    return await response.json()
}

