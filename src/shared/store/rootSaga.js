import {all} from 'redux-saga/effects'
import catWatcherSaga from './cats/sagas.js'
import registrationWatcherSaga from './registration/sagas.js'

/* eslint-disable require-jsdoc */
export default function * rootSaga() {
    yield all([
        catWatcherSaga(),
        registrationWatcherSaga(),
    ])
}
