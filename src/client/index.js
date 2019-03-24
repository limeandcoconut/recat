import React from 'react'
import {hydrate} from 'react-dom'
import {Provider} from 'react-redux'
import {ConnectedRouter} from 'connected-react-router'
import {configureStore} from '../shared/store'
import App from '../shared/app'
import IntlProvider from '../shared/i18n/IntlProvider'
import createHistory from '../shared/store/history'

const history = createHistory()

const store =
    window.store ||
    configureStore({
        initialState: window.__PRELOADED_STATE__,
        history,
    })

// console.log(window.location)
// console.log('history.location')
// console.log(history.location)
// console.log(store.getState())
// console.log(window.__PRELOADED_STATE__.router.location)

hydrate(
    <Provider store={store}>
        <ConnectedRouter history={history}>

            <IntlProvider>
                <App />
            </IntlProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
)

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        module.hot.accept()
    }

    if (!window.store) {
        window.store = store
    }
}
