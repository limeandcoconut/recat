import React from 'react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
// TODO: Checkout
import IntlProvider from '../shared/i18n/IntlProvider'
import Html from './components/HTML'
import App from '../shared/App'

// import {push} from 'connected-react-router'

const serverRenderer = () => (req, res) => {
    // req.store.dispatch(push(req.url))
    const content = renderToString(
        <Provider store={req.store}>

            <StaticRouter location={req.url} context={{}}>
                <IntlProvider>

                    <App />
                </IntlProvider>
            </StaticRouter>

        </Provider>
    )

    // console.log('DUMP', content)

    const state = JSON.stringify(req.store.getState())
    console.log('state', state)
    // console.log('state', Object.keys(state))
    console.log('req', req.url)

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
