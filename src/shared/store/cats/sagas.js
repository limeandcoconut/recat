import {takeLatest, call, put} from 'redux-saga/effects'
import {succeedCat, failCat} from './actions.js'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('CATS/REQUEST_CAT', workerSaga)
}

function * workerSaga() {
    try {
        const src = yield call(fetchCat)

        console.log('src')
        console.log(src)

        yield put(succeedCat(src))
    } catch (error) {
        yield put(failCat(error))
    }
}

function fetchCat() {

    return new Promise(async (resolve) => {
        resolve('https://place-hold.it/300x500')
        return
        // resolve('https://purr.objects-us-east-1.dream.io/i/008_-_uZCLhu4.gif')
        // return
        const response = await fetch('https://aws.random.cat/meow', {method: 'GET'})
        const json = await response.json()
        resolve(json.file)
    })
}
