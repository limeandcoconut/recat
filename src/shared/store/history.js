import createMemoryHistory from 'history/createMemoryHistory'
import createBrowserHistory from 'history/createBrowserHistory'

export const createUniversalHistory = ({initialEntries = []} = {}) => {
    if (__BROWSER__) {
        const history = window.browserHistory || createBrowserHistory({initialEntries})
        if (process.env.NODE_ENV === 'development' && !window.browserHistory) {
            window.browserHistory = history
        }
        return history
    }
    return createMemoryHistory({initialEntries})
}

export default createUniversalHistory
