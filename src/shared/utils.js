import crypto from 'crypto'
const algorithm = 'aes-256-ctr'

/**
 * Encrypt a message using an encryptionKey
 * @function encrypt
 * @param  {String} message         The data to be encrypted
 * @param  {Buffer} encryptionKey   A 256 byte (32 character) encryptionKey
 * @return {String} The encrypted data
 */
export function encrypt(message, encryptionKey) {
    const key = crypto.createHash('sha256').update(encryptionKey).digest()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const encrypted = cipher.update(String(message), 'utf8', 'hex') + cipher.final('hex')
    return iv.toString('hex') + encrypted
}

/**
 * Decrypt a message
 * @function decrypt
 * @param  {String} encryptedMessage    The encrypted data
 * @param  {Buffer} encryptionKey       The encryption key used to decrypt this data
 * @return {String} The decrypted data
 */
export function decrypt(encryptedMessage, encryptionKey) {
    const key = crypto.createHash('sha256').update(encryptionKey).digest()
    const stringValue = String(encryptedMessage)
    const iv = Buffer.from(stringValue.slice(0, 32), 'hex')
    const encrypted = stringValue.slice(32)
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}

const epoch = Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000)

/**
 * Generates a URL safe, 29 character long unique ID based on 64 bits of random
 * @function randomId
 * @return {String} A 29 character long string
 */
export function randomId() {
    const locality = (Math.floor(Date.now() / 1000) - epoch)
    .toString()
    .padStart(8, '0')

    const rand = crypto.randomBytes(8)
    .toString('base64')
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .substr(0, 11)

    return `${locality}${rand}`
}

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

