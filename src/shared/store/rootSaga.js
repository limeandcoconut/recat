import {all} from 'redux-saga/effects'
import catWatcherSaga from './cats/sagas.js'
import authWatcherSaga from './auth/sagas.js'

/* eslint-disable require-jsdoc */
export default function * rootSaga() {
    yield all([
        catWatcherSaga(),
        authWatcherSaga(),
    ])
}
