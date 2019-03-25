import {takeLatest, call, put, all} from 'redux-saga/effects'
import {succeedCat, failCat} from './actions.js'
import {showToast, hideToast} from '../toast/actions'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('CATS/REQUEST_CAT', workerSaga)
}

function * workerSaga() {
    try {
        const src = yield call(fetchCat)

        console.log('src')
        console.log(src)

        yield all([
            put(succeedCat(src)),
            put(hideToast()),
        ])
    } catch (error) {
        yield all([
            put(failCat(error)),
            put(showToast({message: error, style: 'error'})),
        ])
    }
}

function fetchCat() {

    return new Promise(async (resolve) => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        resolve('https://place-hold.it/300x500')
        return
        // resolve('https://purr.objects-us-east-1.dream.io/i/008_-_uZCLhu4.gif')
        // return
        const response = await fetch('https://aws.random.cat/meow', {method: 'GET'})
        const json = await response.json()
        resolve(json.file)
    })
}
