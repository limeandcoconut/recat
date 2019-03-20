import {takeLatest, call, put} from 'redux-saga/effects'
import {succeedAuth, failAuth} from './actions.js'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('AUTH/REQUEST_AUTH', workerSaga)
}

// const authForm = (state) => {
//     return state.auth.form
// }

function * workerSaga() {
    // const form = yield select(authForm)
    try {
        const {success, error} = yield call(makeAuthRequest)
        console.log('error')
        console.log(error)

        if (!success) {
            yield put(failAuth(error))
            return
        }
        yield put(succeedAuth())
    } catch (error) {
        yield put(failAuth(error))
    }
}

function makeAuthRequest() {
    return fetch('http://localhost:8500/auth/check', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        // body: JSON.stringify(form),
    })
    .then((response) => {
        return response.json()
    })
}

