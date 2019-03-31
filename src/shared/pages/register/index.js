import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
import {updateRegistration, requestRegistration, resetRegistration} from '../../store/registration/actions'
import Input from '../../components/input'
import sharedStyles from '../login/login.module.less'
import styles from './register.module.less'
import Beater from '../../components/beater'
import {push} from 'connected-react-router'
import {Redirect} from 'react-router-dom'

class Register extends React.Component {
    // setLanguage = (e) => {
    //     //this.store.dispatch(setLocale(e.target.value))
    //     this.props.setLocale(e.target.value);
    // };

    handleChange = (e) => {
        const {name, value} = e.target
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

                { ['username', 'password', 'email'].map((name) => (
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

                <div className={sharedStyles.tempContainer} >
                    <button onClick={() => {
                        this.props.updateRegistration({
                            name: 'username',
                            value: 'lime',
                        })
                        this.props.updateRegistration({
                            name: 'password',
                            value: 'limeLIME1!',
                        })
                        this.props.updateRegistration({
                            name: 'email',
                            value: 'messagethesmith@gmail.com',
                        })
                    }}
                    >
                    fill
                    </button>
                </div>
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
    // null,
    // {pure: false}
)(Register)
