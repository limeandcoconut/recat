import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {updateRegistration, requestRegistration} from '../../store/auth/actions'
// import {ReactComponent as ReactLogo} from './assets/react.svg'
// import Features from './components/Features';
// import css from './App.module.css'
// import {Switch, Route} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
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
        this.props.updateRegistration({name, value})
    }

    render() {
        const {success, requested, form, error} = this.props

        return (
            <div /* className={css.wrapper} */>
                {error &&
                    <div>{JSON.stringify(error, null, 4)}</div>
                }
                {success &&
                    <div>success</div>
                }
                {!requested && !success ? (
                    <div>
                        <div>
                            <label>
                                    username
                                <input type="text" name="username" value={form.username} onChange={this.handleChange} required/>
                            </label>
                        </div>
                        <div>
                            <label>
                                    password
                                <input type="password" name="password" value={form.password} onChange={this.handleChange} required/>
                            </label>
                        </div>
                        <div>
                            <label>
                                    email
                                <input type="email" name="email" value={form.email} onChange={this.handleChange} required/>
                            </label>
                        </div>

                        <button
                            onClick={() => {

                                    this.props.updateRegistration({
                                        name: 'username', 
                                        value:'lime',
                                    })
                                    this.props.updateRegistration({
                                        name: 'password', 
                                        value:'limeLIME1!',
                                    })
                                    this.props.updateRegistration({
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
                            onClick={this.props.requestRegistration}
                            >
                            Register
                        </button>
                    </div>
                ) : (
                    <div>requested...</div>
                )}
            </div>
        )
    }
}

const mapDispatchToProps = {
    updateRegistration,
    requestRegistration,
}

const mapStateToProps = ({auth: {registration: {success, requested, error} = {}, form} = {}}) => ({
    success,
    requested,
    form,
    error,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {pure: false}
)(Register)
