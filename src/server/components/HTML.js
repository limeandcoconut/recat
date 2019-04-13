/* eslint-disable react/no-danger */
import * as React from 'react'
import Helmet from 'react-helmet'
import siteMeta from '../../../config/meta'

export default class HTML extends React.Component {
    render() {
        const head = Helmet.renderStatic()
        const {children, scripts = [], css = [], state = {}} = this.props
        return (
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta property="twitter:image" content={siteMeta.twitter.image.src} />
                    {head.base.toComponent()}
                    {head.title.toComponent()}
                    {head.meta.toComponent()}
                    {head.link.toComponent()}
                    {css.map((href) => {
                        return <link key={href} rel="stylesheet" href={href} />
                    })}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.__PRELOADED_STATE__ = ${state}`,
                        }}
                    />
                </head>
                <body>
                    <div id="app" dangerouslySetInnerHTML={{__html: children}} />
                    {scripts.map((src) => {
                        return <script key={src} src={src} />
                    })}
                </body>
            </html>
        )
    }
}
