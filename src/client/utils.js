/**
 * @function supportsWebp
 * @return {boolean} Returns whether or not the browser supports webp images.
 */
export async function supportsWebp() {
    if (!self.createImageBitmap) {
        return false
    }

    // Base64 encoded image
    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
    // To blob
    const blob = await fetch(webpData).then((response) => response.blob())
    // To bitmap?
    return createImageBitmap(blob).then(() => true, () => false)
}

