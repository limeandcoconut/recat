import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {updateLogin, requestLogin} from '../../store/login/actions'
import {requestAuth} from '../../store/auth/actions'
import Input from '../../components/input'
import styles from './login.module.less'
import Beater from '../../components/beater'
import {Redirect} from 'react-router-dom'

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
        const {success, requested, form, authRequested, authSuccess, authError} = this.props

        return (
            <div className={styles.wrapper}>

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
                    onClick={this.props.requestLogin}
                    className={styles.button}
                >
                    Login
                </button>

                {requested && (
                    <div className={styles.requestedOverlay} >
                        <Beater className={styles.beater}/>
                    </div>
                )}

                {success &&
                    <div>
                        success
                        <Redirect to={{pathname: '/'}}/>
                    </div>
                }

                <div className={styles.tempContainer} >

                    <button
                        onClick={() => {

                            this.props.updateLogin({
                                name: 'username',
                                value: 'lime',
                            })
                            this.props.updateLogin({
                                name: 'password',
                                value: 'limeLIME1!',
                            })
                            this.props.updateLogin({
                                name: 'email',
                                value: 'messagethesmith@gmai.com',
                            })
                            console.log(form)

                        }}
                        className={styles.tempButton}
                    >
                        fill
                    </button>

                    <button
                        type="button"
                        onClick={this.props.requestAuth}
                        className={styles.tempButton2}
                    >
                        check auth
                    </button>

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
            </div>
        )
    }
}

const mapDispatchToProps = {
    updateLogin,
    requestLogin,
    requestAuth,
}

const mapStateToProps = ({login: {success, requested, form} = {}, auth: {success: authSuccess, requested: authRequested, error: authError} = {}}) => ({
    success,
    requested,
    form,
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
