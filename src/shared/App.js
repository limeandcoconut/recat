import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { setLocale } from './store/app/actions';
import { requestCat } from './store/cats/actions'
import { ReactComponent as ReactLogo } from './assets/react.svg';
import Features from './components/Features';
import css from './App.module.css';
// import {Switch, Route} from 'react-router-dom'
import {NavLink, Switch, Route} from 'react-router-dom'
// import {renderRoutes} from 'react-router-config'
import routes from '../shared/routes'
// import PrivateRoute from './components/PrivateRoute'


class App extends React.PureComponent {
    setLanguage = (e) => {
        //this.store.dispatch(setLocale(e.target.value))
        this.props.setLocale(e.target.value);
    };

    render() {
        const { t, fetchingCat, catError, catSrc, requestCat } = this.props; 

        return (
            <div className={css.wrapper}>

                <nav>
                    <NavLink to="/page1">
                        Page 1
                    </NavLink>
                    <NavLink to="/page2">
                        Page 2
                    </NavLink> 
                </nav>

                <Switch>
                    { routes.map((route) => <Route key={ route.path } { ...route } />) }
                </Switch>

                <Helmet defaultTitle="React SSR Starter" titleTemplate="%s – React SSR Starter" />


                {catSrc ? (
                    <div>
                        <img src={catSrc} className="cat-pic" alt="A pic of the bestest kitty cat evar!" />
                        <p className="App-intro">Keep clicking for new cats</p>
                    </div>
                ) : (
                    <div>
                        <ReactLogo className={css.reactLogo} />
                        <p className="App-intro">Replace the logo with a cat!</p>
                    </div>
                )}

                {fetchingCat ? (
                    <button disabled>Fetching...</button>
                ) : (
                    <button onClick={requestCat}>Request a Cat</button>
                )}

                {catError && <p style={{color: "red"}}>{JSON.stringify(catError)}</p> &&  console.log(catError)}

                <Features />

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
    requestCat,
};

const mapStateToProps = ({cats: {fetching, error, src} = {}}) => ({
    fetchingCat: fetching, 
    catError: error,
    catSrc: src,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNamespaces()(App));
