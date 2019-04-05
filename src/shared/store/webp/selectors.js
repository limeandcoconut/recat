/**
 * @function imageId
 * @param  {object} state The application store.
 * @return {boolean} A flag indicating webp support on this client.
 */
export const webpSupport = (state) => {
    return state.webp.supported
}
