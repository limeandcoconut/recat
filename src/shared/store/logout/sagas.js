import {takeLatest, call, put, all} from 'redux-saga/effects'
import {succeedLogout, failLogout} from './actions.js'
import {failAuth} from '../auth/actions.js'
import {showToast, hideToast} from '../toast/actions'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('LOGOUT/REQUEST_LOGOUT', workerSaga)
}

function * workerSaga() {
    try {
        const {success, error} = yield call(makeLogoutRequest)
        // let promise
        // if (!success) {
        //     promise = put(failLogout(error))
        //     // yield all([
        //     //     put(failLogout(error)),
        //     //     put(failAuth(error)),
        //     // ])
        //     // return
        // }
        if (!success) {
            yield all([
                put(failLogout(error)),
                put(failAuth('intentional logout')),
                put(showToast({message: error, style: 'error'})),
            ])
            return
        }
        yield all([
            succeedLogout(),
            put(failAuth('intentional logout')),
            put(hideToast()),
        ])
        // TODO: Probs show toast that logout failed here. "Wait for expiry"
        // let promise = success ? succeedLogout() : failLogout(error)
        // promise = put(promise)
        // yield all([
        //     promise,
        //     put(failAuth()),
        // ])
    } catch (error) {
        yield all([
            put(showToast({message: error, style: 'error'})),
            put(failLogout(error)),
            put(failAuth(error)),
        ])
    }
}

function makeLogoutRequest() {
    return fetch('https://recat.jacobsmith.tech/auth/logout', {
        method: 'POST',
    })
    .then((response) => {
        return response.json()
    })
}

