export const extractSession = (req) => {
    const cookie = req.header('cookie')
    if (!cookie) {
        return false
    }
    const match = cookie.match(/session=(\w+)/)
    return match && match[1] ? match[1] : false
}
