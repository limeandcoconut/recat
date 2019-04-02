import {produce} from 'immer'

export const initialState = Object.freeze({
    supported: null,
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {supported} = {}} = action
        switch (type) {
        case 'WEBP/SET_SUPPORT':
            draft.supported = supported
            break
        default:
            // Handled by immer. yay :D :3
        }
    })
