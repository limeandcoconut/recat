import {takeLatest, call, put, all, select} from 'redux-saga/effects'
import {succeedCat, failCat} from './actions.js'
import {showToast, hideToast} from '../toast/actions'
import {webpSupport} from '../webp/selectors'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('CATS/REQUEST_CAT', workerSaga)
}

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

function fetchCat(supported) {
    return () => new Promise(async (resolve) => {
        const response = await fetch(`/auth/images/next`, {
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
        const id = response.headers.get('file-name')
        const blob = await response.blob()
        resolve({image: URL.createObjectURL(blob), id})
    })
}
