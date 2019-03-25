import * as React from 'react'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {withNamespaces} from 'react-i18next'
import {setLocale} from './store/app/actions'
import styles from './app.module.less'
import {Switch, Route} from 'react-router-dom'
import AuthRoute from './components/authroute'
import routes from './routes'
import Header from './components/header'
import Toast from './components/toast'

class App extends React.Component {
    setLanguage = (e) => {
        this.props.setLocale(e.target.value)
    };

    render() {
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

                    <Helmet defaultTitle="React SSR Starter" titleTemplate="%s – React SSR Starter" />

                    {/* <div className={styles.i18n} >
                        <h2>{t('i18n-example')}</h2>
                        <button value="de_DE" onClick={this.setLanguage}>
                            Deutsch
                        </button>
                        <button value="en_US" onClick={this.setLanguage}>
                            English
                        </button>
                    </div> */}
                </main>
                {// TODO: referer and stuff
                }
                <div className={styles.footer}>
                    <div>
                        A thing by <a className={styles.footerLink} href="https://jacobsmith.tech" target="_blank">Jacob Smith</a>
                    </div>
                </div>
                <Toast/>
            </div>
        )
    }
}

const mapDispatchToProps = {
    setLocale,
}

export default connect(
    null,
    mapDispatchToProps
)(withNamespaces()(App))
