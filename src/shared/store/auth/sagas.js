import {takeLatest, call, put, select} from 'redux-saga/effects'
// import axios from 'axios'
import {succeedRegistration, failRegistration} from './actions.js'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('AUTH/REQUEST_REGISTRATION', workerSaga)
}

const registerForm = (state) => {
    // console.log('saga', state)
    return state.auth.form
    // return state.auth.registration.form
}

function * workerSaga() {
    const form = yield select(registerForm)
    try {
        // console.log('here', form)
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
    // console.log('client form', form)
    // console.log('client form', JSON.stringify(form))
    // return () => axios({
    //     method: 'post',
    //     url: 'http://localhost:8500/auth/register',
    //     body: form,
    // }).then((response) => {
    //     return response.data
    // })

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

