import * as React from 'react'
import {connect} from 'react-redux'
import {updateRegistration, requestRegistration, resetRegistration} from '../../store/registration/actions'
import Input from '../../components/input'
import sharedStyles from '../login/login.module.less'
import styles from './register.module.less'
import Beater from '../../components/beater'
import {push} from 'connected-react-router'
import {Redirect} from 'react-router-dom'
import Helmet from 'react-helmet'

class Register extends React.Component {

    handleChange = (event) => {
        const {name, value} = event.target
        this.props.updateRegistration({name, value})
    }

    shouldComponentUpdate(newProps, /* newState */) {
        if (newProps.success) {
            newProps.resetRegistration()
            newProps.push('/login')
            return false
        }
        return true
    }

    render() {
        const {requested, form, authed} = this.props

        return (
            <div className={sharedStyles.wrapper}>
                <Helmet>
                    <title>Register</title>
                </Helmet>

                { ['password', 'email'].map((name) => (
                    <Input
                        name={name}
                        key={name}
                        value={form[name]}
                        disabled={requested}
                        onChange={this.handleChange}
                        className={styles[name]}
                        type={(name === 'email' || name === 'password') ? name : 'text'}
                    />))
                }

                <button
                    disabled={
                        (!form.username && !form.password && !form.email) ||
                        requested
                    }
                    type="button"
                    onClick={this.props.requestRegistration}
                    className={sharedStyles.button}
                >
                    Register
                </button>

                {requested && (
                    <div className={sharedStyles.requestedOverlay} >
                        <Beater className={sharedStyles.beater}/>
                    </div>
                )}

                {authed &&
                    <div>
                        <Redirect to={{pathname: '/'}}/>
                    </div>
                }

            </div>
        )
    }
}

const mapDispatchToProps = {
    updateRegistration,
    requestRegistration,
    resetRegistration,
    push,
}

const mapStateToProps = ({registration: {success, requested, form}, auth: {success: authed}}) => ({
    success,
    requested,
    form,
    authed,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Register)
