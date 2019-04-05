import {all} from 'redux-saga/effects'
import catWatcherSaga from './cats/sagas.js'
import registrationWatcherSaga from './registration/sagas.js'
import loginWatcherSaga from './login/sagas.js'
import authWatcherSaga from './auth/sagas.js'
import logoutWatcherSaga from './logout/sagas.js'
import favoriteSagas from './favorite/sagas.js'
const {watcherPutSaga: favoriteWatcherPutSaga, watcherGetSaga: favoriteWatcherGetSaga} = favoriteSagas
/* eslint-disable valid-jsdoc */

/**
 * A generator combinding all the project sagas.
 * @function * rootSaga
 * @return {undefined}
 */
export default function * rootSaga() {
    yield all([
        catWatcherSaga(),
        registrationWatcherSaga(),
        loginWatcherSaga(),
        authWatcherSaga(),
        logoutWatcherSaga(),
        favoriteWatcherPutSaga(),
        favoriteWatcherGetSaga(),
    ])
}
