export const showToast = ({message, style}) => ({
    type: 'TOAST/SHOW',
    payload: {
        display: true,
        message,
        style,
    },
})

export const hideToast = () => ({
    type: 'TOAST/HIDE',
    payload: {
        display: false,
        style: '',
    },
})
