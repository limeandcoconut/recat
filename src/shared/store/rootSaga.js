import {all} from 'redux-saga/effects'
import watcherSaga from './cats/sagas.js'

/* eslint-disable require-jsdoc */
export default function * rootSaga() {
    yield all([
        watcherSaga(),
    ])
}
