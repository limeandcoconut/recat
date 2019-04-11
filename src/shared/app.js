import * as React from 'react'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import styles from './app.module.less'
import {Switch, Route, withRouter} from 'react-router-dom'
import AuthRoute from './components/authroute'
import routes from './routes'
import Header from './components/header'
import Toast from './components/toast'
import {productionHost} from '../../config/config.js'
import siteMeta from '../../config/meta'
import path from 'path'

class App extends React.Component {

    render() {
        const {location} = this.props
        const baseUrl = path.join(productionHost, location.pathname)
        return (
            <div className={styles.layout}>

                <Header variant="a" />

                <div className={styles.rightDivision} >
                    <Header variant="b" />
                </div>

                <main className={styles.main}>
                    <Switch>
                        {
                            routes.map((route) => {
                                const Component = route.auth ? AuthRoute : Route
                                return <Component key={ route.path } { ...route } />
                            })
                        }
                    </Switch>

                    <Helmet
                        titleTemplate={`%s | ${siteMeta.title.default}`}
                        defaultTitle={siteMeta.title.default}
                    >

                        <meta name="description" content={siteMeta.description} />

                        <meta property="og:title" content={siteMeta.title.default} />
                        <meta property="og:description" content={siteMeta.og.description} />
                        <meta property="og:image" content={siteMeta.og.image.src} />
                        <meta property="og:image:width" content={siteMeta.og.imageWidth} />
                        <meta property="og:image:height" content={siteMeta.og.imageHeight} />
                        <meta property="og:url" content={baseUrl} />
                        <meta property="og:type" content={siteMeta.og.type} />

                        <meta property="twitter:image" content={siteMeta.twitter.image.src} />
                        <meta property="twitter:image:alt" content={siteMeta.twitter.image.alt} />
                        <meta name="twitter:card" content={siteMeta.twitter.card} />
                        <meta name="twitter:creator" content={siteMeta.twitter.creator} />

                        <meta name="theme-color" content={siteMeta.color} id="theme_color" />
                        <meta name="msapplication-TileColor" content={siteMeta.color} />
                        <meta name="msapplication-TileImage" content={siteMeta.favicons.ms} />
                        {process.env.NODE_ENV === 'production' && <link rel="manifest" href={siteMeta.manifest} /> }
                        {process.env.NODE_ENV === 'production' && <link rel="shortcut icon" href={siteMeta.favicons.default} /> }
                        {process.env.NODE_ENV === 'production' && <link rel="icon" type="image/png" sizes="32x32" href={siteMeta.favicons.x32} /> }
                        {process.env.NODE_ENV === 'production' && <link rel="icon" type="image/png" sizes="16x16" href={siteMeta.favicons.x16} /> }
                        <link rel="apple-touch-icon" sizes="180x180" href={siteMeta.favicons.apple} />
                        <link rel="mask-icon" href={siteMeta.favicons.safariMask} color={siteMeta.color} />

                        {/* crossOrigin="non-boolean-value" seems to be necessary for Helmet. I'm NOT crazy about this 😒 */}
                        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="crossOrigin" />
                        <link rel="preload" href="https://fonts.gstatic.com/s/nunito/v10/XRXV3I6Li01BKofINeaBTMnFcQ.woff2" as="font" type="font/woff2" crossOrigin="crossOrigin" />

                    </Helmet>
                </main>
                <footer className={styles.footer}>
                    <div>
                        <div className="hidden-md" >A thing by </div><a className={styles.footerLink} href="https://jacobsmith.tech" target="_blank"><span className="visible-md" >By </span>Jacob Smith</a>
                    </div>
                </footer>
                <Toast/>
            </div>
        )
    }
}

export default withRouter(connect()(App))
