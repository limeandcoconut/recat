// import '@babel/polyfill'
import * as React from 'react'
import {hydrate} from 'react-dom'
import {Provider} from 'react-redux'
import {ConnectedRouter} from 'connected-react-router'
import {configureStore} from '../shared/store'
import App from '../shared/app'
import createHistory from '../shared/store/history'
import ReactGA from 'react-ga'
import {gaDevID, gaProductionID} from '../../config/config.js'
import {supportsWebp} from './utils'
import {setSupport} from '../shared/store/webp/actions'

// const {setSupport} = () => import(/* webpackChunkName: "home" */ './modules/home/index');

// Create a history
const history = createHistory()

// Create/use the store
// history MUST be passed here if you want syncing between server on initial route
const store =
    window.store ||
    configureStore({
        initialState: window.__PRELOADED_STATE__,
        history,
    })

// Check for webp support.
// This is necessary because the browser won't send its default accepts header when the client fetches.
// On the server we want to know if we can serve a webp.
// TODO: Make this faster... And unnecessary. Initial load usually doesn't have this info.
const checkWebp = async () => {
    // const {supportsWebp} = await import(/* webpackChunkName: "chunk1", webpackPrefetch: true */ '../shared/utils')
    const isSupported = await supportsWebp()
    // const {setSupport} = await import(/* webpackChunkName: "chunk1", webpackPrefetch: true */ '../shared/store/webp/actions')
    store.dispatch(setSupport(isSupported))
}
checkWebp()

hydrate(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
)

const addAnalytics = async () => {
    // const ReactGA = await import(/* webpackPrefetch: true */ 'react-ga')
    // const {gaDevID, gaProductionID} = await import(/* webpackPrefetch: true */ '../../config/config.js')
    // Ad google analytics
    const gaId = process.env.NODE_ENV === 'production' ? gaProductionID : gaDevID
    ReactGA.initialize(gaId)
    // Pageview on route change
    history.listen((location) => ReactGA.pageview(location.pathname))
}
addAnalytics()

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        module.hot.accept()
    }

    if (!window.store) {
        window.store = store
    }
} else if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope)
        }, function(error) {
            console.log('ServiceWorker registration failed: ', error)
        })
    })
}
