import {takeLatest, call, put, all} from 'redux-saga/effects'
import {succeedLogout, failLogout} from './actions.js'
import {failAuth} from '../auth/actions.js'

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
        // TODO: Probs show toast that logout failed here. "Wait for expiry"
        let promise = success ? succeedLogout() : failLogout(error)
        promise = put(promise)
        yield all([
            promise,
            put(failAuth()),
        ])
    } catch (error) {
        yield all([
            put(failLogout(error)),
            put(failAuth(error)),
        ])
    }
}

function makeLogoutRequest() {
    return fetch('http://localhost:8500/auth/logout', {
        method: 'POST',
    })
    .then((response) => {
        return response.json()
    })
}

