import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {updateRegistration, requestRegistration, toggleLogin} from '../../store/auth/actions'
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
        this.props.updateRegistration({name, value})
    }

    render() {
        const {success, requested, form, error} = this.props

        return (
            <div /* className={css.wrapper} */>
                <Link to="/login"> Login </Link>

                {!requested && !success ? (
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

                {error &&
                    <div>{JSON.stringify(error, null, 4)}</div>
                }

                {success &&
                    <div>
                        success
                        <Redirect to={{pathname: "/login"}}/>
                    </div>
                }
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
    // null,
    // {pure: false}
)(Register)
