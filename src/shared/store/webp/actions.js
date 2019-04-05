/**
 * Action creator
 * @function setSupport
 * @param {boolean} supported A flag indicating webp support on this client.
 * @return {object} An object with type and a payload of state to alter.
 */
export const setSupport = (supported) => ({
    type: 'WEBP/SET_SUPPORT',
    payload: {
        supported,
    },
})

