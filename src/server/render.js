import React from 'react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
// TODO: Checkout
import IntlProvider from '../shared/i18n/IntlProvider'
import Html from './components/HTML'
import App from '../shared/app'

/**
 * @function serverRenderer
 * @param {object} request Express like request object.
 * @param {object} response Express like response object.
 * @return {object} The passed response.
 */
const serverRenderer = () => (request, response) => {
    const staticContext = {}
    const content = renderToString(
        <Provider store={request.store}>

            <StaticRouter location={request.url} context={staticContext}>
                <IntlProvider>

                    <App />
                </IntlProvider>
            </StaticRouter>

        </Provider>
    )

    const state = JSON.stringify(request.store.getState())

    if (staticContext.status) {
        response.status(staticContext.status)
    }

    return response.send(
        '<!doctype html>' +
            renderToString(
                <Html
                    css={[response.locals.assetPath('bundle.css'), response.locals.assetPath('vendor.css')]}
                    scripts={[response.locals.assetPath('bundle.js'), response.locals.assetPath('vendor.js')]}
                    state={state}
                >
                    {content}
                </Html>
            )
    )
}

export default serverRenderer
