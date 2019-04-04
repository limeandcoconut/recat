import {takeLatest, call, put, select, all} from 'redux-saga/effects'
import {succeedFavoritePut, succeedFavoriteRequest, failFavoritePut, failFavoriteRequest} from './actions'
import {showToast, hideToast} from '../toast/actions'
import {webpSupport} from '../webp/selectors'

/* eslint-disable require-jsdoc */
export function * watcherGetSaga() {
    yield takeLatest('FAVORITE/REQUEST_FAVORITE', workerGetSaga)
}

function * workerGetSaga() {
    const supported = yield select(webpSupport)
    try {
        const {error, favorite} = yield call(makeFavoriteGet(supported))

        if (!favorite) {
            yield all([
                put(failFavoriteRequest(error)),
                put(showToast({message: error, style: 'error'})),
            ])
            return
        }
        yield all([
            put(succeedFavoriteRequest(favorite)),
            put(hideToast()),
        ])
    } catch (error) {
        yield all([
            put(failFavoriteRequest(error)),
            put(showToast({message: error, style: 'error'})),
        ])
    }
}

function makeFavoriteGet(supported) {
    return () => new Promise(async (resolve) => {
        const response = await fetch(`/auth/images/favorite`, {
            method: 'GET',
            headers: {
                Accept: supported ? 'image/webp' : 'image/png',
            },
        })
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            const json = await response.json()
            resolve(json)
            return
        }
        const blob = await response.blob()
        resolve({favorite: URL.createObjectURL(blob)})
    })
}

export function * watcherPutSaga() {
    yield takeLatest('FAVORITE/PUT_FAVORITE', workerPutSaga)
}

const imageId = (state) => {
    return state.cats.id
}

function * workerPutSaga() {
    const id = yield select(imageId)
    const supported = yield select(webpSupport)
    try {
        const {error, favorite} = yield call(makeFavoritePut(id, supported))

        if (!favorite) {
            yield all([
                put(failFavoritePut(error)),
                put(showToast({message: error, style: 'error'})),
            ])
            return
        }
        yield all([
            put(succeedFavoritePut(favorite)),
            put(hideToast()),
        ])
    } catch (error) {
        yield all([
            put(failFavoritePut(error)),
            put(showToast({message: error, style: 'error'})),
        ])
    }
}

function makeFavoritePut(id, supported) {
    return () => new Promise(async (resolve) => {
        const response = await fetch(`/auth/images/favorite`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': supported ? 'image/webp' : 'image/png',
            },
            body: JSON.stringify({id}),
        })
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            const json = await response.json()
            resolve(json)
            return
        }
        const blob = await response.blob()
        resolve({favorite: URL.createObjectURL(blob)})
    })
}

export default {
    watcherGetSaga,
    watcherPutSaga,
}
