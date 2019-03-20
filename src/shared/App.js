import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { setLocale } from './store/app/actions';
import { requestCat } from './store/cats/actions'
import { ReactComponent as ReactLogo } from './assets/react.svg';
// import Features from './components/Features';
import css from './App.module.css';
// import {Switch, Route} from 'react-router-dom'
import {NavLink, Switch, Route} from 'react-router-dom'
import AuthRoute from '../shared/components/authroute'
// import {renderRoutes} from 'react-router-config'
import routes from '../shared/routes'
import Header from '../shared/components/header'
import Authed from '../shared/components/authed'
import Anon from '../shared/components/anon'
// import PrivateRoute from './components/PrivateRoute'


class App extends React.Component {
    setLanguage = (e) => {
        //this.store.dispatch(setLocale(e.target.value))
        this.props.setLocale(e.target.value);
    };

    render() {
        const { t, fetchingCat, catError, catSrc, requestCat } = this.props; 

        return (
            <div className={css.wrapper}>

                <Header/>

                <Switch>
                    { 
                        routes.map((route) => {
                            const Component = route.auth ? AuthRoute : Route
                            return <Component key={ route.path } { ...route } />
                        }) 
                    }
                </Switch>

                <Helmet defaultTitle="React SSR Starter" titleTemplate="%s – React SSR Starter" />


                {/* <Features /> */}

                <h2>{t('i18n-example')}</h2>
                <p>
                    <button value="de_DE" onClick={this.setLanguage}>
                        Deutsch
                    </button>
                    <button value="en_US" onClick={this.setLanguage}>
                        English
                    </button>
                </p>
            </div>
        );
    }
}

const mapDispatchToProps = {
    setLocale,
    // requestCat,
};

// const mapStateToProps = ({cats: {fetching, error, src} = {}}) => ({
//     fetchingCat: fetching, 
//     catError: error,
//     catSrc: src,
// })

export default connect(
    null,
    mapDispatchToProps
)(withNamespaces()(App));
