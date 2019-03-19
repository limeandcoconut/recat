import {takeLatest, call, put, select} from 'redux-saga/effects'
import {succeedRegistration, failRegistration} from './actions.js'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('REGISTRATION/REQUEST_REGISTRATION', workerSaga)
}

const registerForm = (state) => {
    return state.registration.form
}

function * workerSaga() {
    const form = yield select(registerForm)
    try {
        const {success, error} = yield call(makeRegisterRequest(form))

        if (!success) {
            yield put(failRegistration(error))
            return
        }
        yield put(succeedRegistration())
    } catch (error) {
        yield put(failRegistration(error))
    }
}

function makeRegisterRequest(form) {
    return () => (fetch('http://localhost:8500/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    })
    .then((response) => {
        return response.json()
    }))
}

