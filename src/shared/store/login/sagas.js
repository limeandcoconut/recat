import {takeLatest, call, put, select, all} from 'redux-saga/effects'
import {succeedLogin, failLogin} from './actions'
import {succeedAuth, failAuth} from '../auth/actions'
import {showToast, hideToast} from '../toast/actions'
import {requestFavorite} from '../favorite/actions'
import {requestCat} from '../cats/actions'

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
                put(showToast({message: error, style: 'error'})),
            ])
            return
        }
        yield all([
            put(succeedLogin()),
            put(succeedAuth()),
            put(hideToast()),
            put(requestFavorite()),
            put(requestCat()),
        ])
    } catch (error) {
        yield all([
            put(failLogin(error)),
            put(failAuth(error)),
            put(showToast({message: error, style: 'error'})),
        ])
    }
}

function makeLoginRequest(form) {
    return async () => {
        const response = await fetch(`/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })

        return await response.json()
    }
}

