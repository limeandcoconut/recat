import {takeLatest, call, put, select, all} from 'redux-saga/effects'
import {succeedRegistration, failRegistration} from './actions.js'
import {showToast, hideToast} from '../toast/actions'

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

function makeRegisterRequest(form) {
    return () => (fetch('https://recat.jacobsmith.tech/auth/register', {
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

