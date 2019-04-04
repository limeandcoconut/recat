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
    } catch (error) {
        yield all([
            put(showToast({message: error, style: 'error'})),
            put(failLogout(error)),
            put(failAuth(error)),
        ])
    }
}

async function makeLogoutRequest() {
    const response = await fetch(`/auth/logout`, {
        method: 'POST',
    })
    return await response.json()
}

