/**
 * Action creator
 * @function showToast
 * @param {object} params An object with two properties, message, and style.
 * @return {object} An object with type and a payload of state to alter.
 */
export const showToast = ({message, style}) => ({
    type: 'TOAST/SHOW',
    payload: {
        display: true,
        message,
        style,
    },
})

/**
 * Action creator
 * @function hideToast
 * @return {object} An object with type and a payload of state to alter.
 */
export const hideToast = () => ({
    type: 'TOAST/HIDE',
    payload: {
        display: false,
        style: '',
    },
})
