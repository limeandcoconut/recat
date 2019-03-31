import {takeLatest, call, put, all} from 'redux-saga/effects'
import {succeedAuth, failAuth} from './actions.js'
import {showToast, hideToast} from '../toast/actions'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('AUTH/REQUEST_AUTH', workerSaga)
}

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

// TODO: Switch all sagas to async await
function makeAuthRequest() {
    return fetch(`/auth/check`, {
        method: 'POST',
    })
    .then((response) => {
        return response.json()
    })
}

