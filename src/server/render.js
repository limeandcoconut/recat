import React from 'react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
// TODO: Checkout
import IntlProvider from '../shared/i18n/IntlProvider'
import Html from './components/HTML'
import App from '../shared/app'

const serverRenderer = () => (req, res) => {
    const staticContext = {}
    const content = renderToString(
        <Provider store={req.store}>

            <StaticRouter location={req.url} context={staticContext}>
                <IntlProvider>

                    <App />
                </IntlProvider>
            </StaticRouter>

        </Provider>
    )

    const state = JSON.stringify(req.store.getState())

    if (staticContext.status) {
        res.status(staticContext.status)
    }

    return res.send(
        '<!doctype html>' +
            renderToString(
                <Html
                    css={[res.locals.assetPath('bundle.css'), res.locals.assetPath('vendor.css')]}
                    scripts={[res.locals.assetPath('bundle.js'), res.locals.assetPath('vendor.js')]}
                    state={state}
                >
                    {content}
                </Html>
            )
    )
}

export default serverRenderer
