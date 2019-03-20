import {takeLatest, call, put, select, all} from 'redux-saga/effects'
import {succeedLogin, failLogin} from './actions.js'
import {succeedAuth, failAuth} from '../auth/actions.js'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('LOGIN/REQUEST_LOGIN', workerSaga)
}

const loginForm = (state) => {
    return state.login.form
}

function * workerSaga() {
    const form = yield select(loginForm)
    try {
        const {success, error} = yield call(makeLoginRequest(form))

        if (!success) {
            yield all([
                put(failLogin(error)),
                put(failAuth(error)),
            ])
            return
        }
        yield all([
            put(succeedLogin()),
            put(succeedAuth()),
        ])
    } catch (error) {
        yield all([
            put(failLogin(error)),
            put(failAuth(error)),
        ])
    }
}

function makeLoginRequest(form) {
    return () => (fetch('http://localhost:8500/auth/login', {
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

