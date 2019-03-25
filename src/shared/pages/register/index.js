import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
import {updateRegistration, requestRegistration, toggleLogin} from '../../store/registration/actions'
import Input from '../../components/input'
import {withRouter, Redirect, Link} from 'react-router-dom'
import sharedStyles from '../login/login.module.less'
import styles from './register.module.less'
import Beater from '../../components/beater'

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

                {error &&
                    <div>{JSON.stringify(error, null, 4)}</div>
                }

                {success &&
                    <div>
                        success
                        <Redirect to={{pathname: '/login'}}/>
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
                            value: 'messagethesmith@gmai.com',
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
}

const mapStateToProps = ({registration: {success, requested, error, form} = {}}) => ({
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
