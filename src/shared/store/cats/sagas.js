import {takeLatest, call, put} from 'redux-saga/effects'
import {succeedCat, failCat} from './actions.js'

/* eslint-disable require-jsdoc */
export default function * watcherSaga() {
    yield takeLatest('CATS/REQUEST_CAT', workerSaga)
}

function * workerSaga() {
    try {
        const src = yield call(fetchCat)
        // const src = response

        console.log('src')
        console.log(src)

        yield put(succeedCat(src))
    } catch (error) {
        yield put(failCat(error))
    }
}

function fetchCat() {
    // return axios({
    //     method: 'get',
    //     url: 'https://aws.random.cat/meow',
    // }).then((response) => {

    //     return response.data.file
    // })

    // return fetch('https://aws.random.cat/meow', {
    //     method: 'GET',
    // })
    // .then((response) => {
    //     return response.json().file
    // })

    return new Promise(async (resolve) => {
        const response = await fetch('https://aws.random.cat/meow', {method: 'GET'})
        const json = await response.json()
        resolve(json.file)
    })
}

// function fetchCat() {
//     return async function() {
//         const response = await fetch('https://aws.random.cat/meow', {method: 'GET'})
//         const json = await response.json()
//         return json.file
//     }
// }
