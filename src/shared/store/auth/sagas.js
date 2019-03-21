import {takeLatest, call, put} from 'redux-saga/effects'
import {succeedAuth, failAuth} from './actions.js'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('AUTH/REQUEST_AUTH', workerSaga)
}

function * workerSaga() {
    try {
        const {success, error} = yield call(makeAuthRequest)

        if (!success) {
            yield put(failAuth(error))
            return
        }
        yield put(succeedAuth())
    } catch (error) {
        yield put(failAuth(error))
    }
}

// TODO: Switch all sagas to async await
function makeAuthRequest() {
    return fetch('http://localhost:8500/auth/check', {
        method: 'POST',
    })
    .then((response) => {
        return response.json()
    })
}

