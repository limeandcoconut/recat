import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {updateLogin, requestLogin} from '../../store/login/actions'
import {requestAuth} from '../../store/auth/actions'
// import {ReactComponent as ReactLogo} from './assets/react.svg'
import Input from '../../components/input';
// import css from './App.module.css'
// import {Switch, Route} from 'react-router-dom'
import {withRouter, Redirect, Link} from 'react-router-dom'
// import {renderRoutes} from 'react-router-config'
// import routes from '../shared/routes'
// import PrivateRoute from './components/PrivateRoute'

class Register extends React.Component {
    // setLanguage = (e) => {
    //     //this.store.dispatch(setLocale(e.target.value))
    //     this.props.setLocale(e.target.value);
    // };

    handleChange = (e) => {
        const {name, value} = e.target
        this.props.updateLogin({name, value})
    }

    render() {
        const {success, requested, form, error, authRequested, authSuccess, authError} = this.props

        return (
            <div /* className={css.wrapper} */>
                <Link to="/register"> Register </Link>

                {!requested && !success && (
                    <div>

                        { ['username', 'password', 'email'].map((name) => (
                            <Input 
                                name={name} 
                                key={name} 
                                value={form[name]} 
                                onChange={this.handleChange}  
                                type={(name === 'email' || name === 'password') ? name : 'text'} 
                            />)) 
                        }

                        <button
                            onClick={() => {

                                    this.props.updateLogin({
                                        name: 'username', 
                                        value:'lime',
                                    })
                                    this.props.updateLogin({
                                        name: 'password', 
                                        value:'limeLIME1!',
                                    })
                                    this.props.updateLogin({
                                        name: 'email', 
                                        value:'messagethesmith@gmai.com',
                                    })
                                    console.log(form)

                            }}
                            >
                            fill
                            </button>
                        <button
                            disabled={!form.username && !form.password && !form.email}
                            type="button"
                            onClick={this.props.requestLogin}
                            >
                            Login
                        </button>
                    </div>
                ) }
                { requested && success === null && (
                    <div>requested...</div>
                )}

                {error &&
                    <div>{JSON.stringify(error, null, 4)}</div>
                }

                {success &&
                    <div>
                        success
                        {/* <Redirect to={{pathname: "/register"}}/> */}
                        <Link to="/">CATZ</Link>
                    </div>
                }
                <button
                    type="button"
                    onClick={this.props.requestAuth}
                    >
                    check auth
                </button>
                {console.log(authRequested, authSuccess, authError)}
                {authRequested && authSuccess === null && 
                    <div> 
                        Auth: requested...
                    </div>
                }
                {authError && 
                    <div> 
                        {JSON.stringify(authError, null, 4)}
                    </div>
                }
                {authSuccess && 
                    <div> 
                        Authed: {String(authSuccess).toUpperCase()}
                    </div>
                }
            </div>
        )
    }
}

const mapDispatchToProps = {
    updateLogin,
    requestLogin,
    requestAuth,
}

const mapStateToProps = ({login: {success, requested, error, form} = {}, auth: {success: authSuccess, requested: authRequested, error: authError} = {}}) => ({
    success,
    requested,
    form,
    error,
    authSuccess,
    authRequested,
    authError,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // null,
    // {pure: false}
)(Register)
