import {takeLatest, call, put, select, all} from 'redux-saga/effects'
import {succeedFavoritePut, succeedFavoriteRequest, failFavoritePut, failFavoriteRequest} from './actions'
import {showToast, hideToast} from '../toast/actions'
import {webpSupport} from '../webp/selectors'

/**
 * A generator to pass along control when an action is fired.
 * @generator
 * @function watcherGetSaga
 * @return {undefined}
 */
export function * watcherGetSaga() {
    yield takeLatest('FAVORITE/REQUEST_FAVORITE', workerGetSaga)
}

/**
 * The generator that handles api calls and dispatching responses to the store.
 * @generator
 * @function workerGetSaga
 * @return {undefined}
 */
function * workerGetSaga() {
    const supported = yield select(webpSupport)
    try {
        const {error, favorite} = yield call(makeFavoriteGet(supported))

        if (!favorite) {
            yield put(failFavoriteRequest(error))
            return
        }
        yield put(succeedFavoriteRequest(favorite))
    } catch (error) {
        yield put(failFavoriteRequest(error))
    }
}

/**
 * Make a request to the api.
 * @function makeFavoriteGet
 * @param  {boolean} supported A flag indicating webp support on this client.
 * @return {async-function} An async function which resolves when it has parsed the server's response.
 */
function makeFavoriteGet(supported) {
    return async () => {
        const response = await fetch(`/auth/images/favorite`, {
            method: 'GET',
            headers: {
                Accept: supported ? 'image/webp' : 'image/png',
            },
        })
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            const json = await response.json()
            return json
        }
        const blob = await response.blob()
        return {favorite: URL.createObjectURL(blob)}
    }
}

/**
 * A generator to pass along control when an action is fired.
 * @generator
 * @function watcherPutSaga
 * @return {undefined}
 */
export function * watcherPutSaga() {
    yield takeLatest('FAVORITE/PUT_FAVORITE', workerPutSaga)
}

/**
 * @function imageId
 * @param  {object} state The application store.
 * @return {string} A unique identifier for an image.
 */
const imageId = (state) => {
    return state.cats.id
}

/**
 * The generator that handles api calls and dispatching responses to the store.
 * @generator
 * @function workerPutSaga
 * @return {undefined}
 */
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

/**
 * Make a request to the api.
 * @function makeFavoritePut
 * @param  {object} id A unique identifier (filename) to indicate the favorite image to the server.
 * @param  {boolean} supported A flag indicating webp support on this client.
 * @return {async-function} An async function which resolves when it has parsed the server's json response.
 */
function makeFavoritePut(id, supported) {
    return async () => {
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
            return json
        }
        const blob = await response.blob()
        return {favorite: URL.createObjectURL(blob)}
    }
}

export default {
    watcherGetSaga,
    watcherPutSaga,
}
