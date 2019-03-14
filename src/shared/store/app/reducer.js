import {produce} from 'immer'
// import {ActionTypes} from './actions'

export const initialState = Object.freeze({
    locale: 'en_US',
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload} = action
        if (type === 'APP/SET_LOCALE') {
            draft.locale = payload
        }

        // switch (type) {
        // case ActionTypes.SETLOCALE: {
        //     return
        // }
        // }
    })
