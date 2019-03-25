import {produce} from 'immer'

export const initialState = Object.freeze({
    display: false,
    message: '',
    style: '',
})

export default (state = initialState, action) =>
    produce(state, (draft) => {
        const {type, payload: {display, message, style} = {}} = action
        if (type !== 'TOAST/SHOW' && type !== 'TOAST/HIDE') {
            return
        }
        draft.display = display
        draft.message = message
        draft.style = style
        // switch (type) {
        // case 'TOAST/SHOW':
        //     draft.display = display
        //     draft.message = null
        //     break
        // case 'TOAST/HIDE':
        //     draft.requested = requested
        //     draft.src = src
        //     draft.error = null
        //     break
        // default:
        //     // Handled by immer. yay :D :3
        // }
    })
