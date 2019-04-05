import {takeLatest, call, put, all, select} from 'redux-saga/effects'
import {succeedCat, failCat} from './actions.js'
import {showToast, hideToast} from '../toast/actions'
import {webpSupport} from '../webp/selectors'
/* eslint-disable valid-jsdoc */

/**
 * A generator to pass along control when an action is fired.
 * @function * watcherSaga
 * @return {undefined}
 */
export default function * watcherSaga() {
    yield takeLatest('CATS/REQUEST_CAT', workerSaga)
}

/**
 * The generator that handles api calls and dispatching responses to the store.
 * @function * workerSaga
 * @return {undefined}
 */
function * workerSaga() {
    try {
        const supported = yield select(webpSupport)
        const {error, image, id} = yield call(fetchCat(supported))

        if (!image) {
            yield all([
                put(failCat(error)),
                put(showToast({message: error, style: 'error'})),
            ])
            return
        }

        yield all([
            put(succeedCat(image, id)),
            put(hideToast()),
        ])
    } catch (error) {
        yield all([
            put(failCat(error)),
            put(showToast({message: error, style: 'error'})),
        ])
    }
}

/**
 * Make a request to the api.
 * @function fetchCat
 * @param  {boolean} supported A flag for webp support.
 * @return {async function} An async function which resolves when it has parsed the server's.
 *                          Response will either be a blob as an image url or json with an error.
 */
function fetchCat(supported) {
    return async () => {
        const response = await fetch(`/auth/images/next`, {
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
        const id = response.headers.get('file-name')
        const blob = await response.blob()
        return {image: URL.createObjectURL(blob), id}
    }
}
