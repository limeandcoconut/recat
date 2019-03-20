import {all} from 'redux-saga/effects'
import catWatcherSaga from './cats/sagas.js'
import registrationWatcherSaga from './registration/sagas.js'
import loginWatcherSaga from './login/sagas.js'
import authWatcherSaga from './auth/sagas.js'

/* eslint-disable require-jsdoc */
export default function * rootSaga() {
    yield all([
        catWatcherSaga(),
        registrationWatcherSaga(),
        loginWatcherSaga(),
        authWatcherSaga(),
    ])
}
