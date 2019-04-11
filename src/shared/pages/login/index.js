import * as React from 'react'
import {connect} from 'react-redux'
import {updateLogin, requestLogin} from '../../store/login/actions'
import {requestAuth} from '../../store/auth/actions'
import Input from '../../components/input'
import styles from './login.module.less'
import Beater from '../../components/beater'
import {Redirect} from 'react-router-dom'
import Helmet from 'react-helmet'

class Register extends React.Component {

    handleChange = (event) => {
        const {name, value} = event.target
        this.props.updateLogin({name, value})
    }

    render() {
        const {requested, form, authRequested, authed, authError} = this.props

        return (
            <div className={styles.wrapper}>
                <Helmet>
                    <title>Log in</title>
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

                {authed &&
                    <div>
                        <Redirect to={{pathname: '/'}}/>
                    </div>
                }

                <div className={styles.tempContainer} >

                    <button
                        onClick={() => {

                            this.props.updateLogin({
                                name: 'password',
                                value: 'limeLIME1!',
                            })
                            this.props.updateLogin({
                                name: 'email',
                                value: 'messagethesmith@gmail.com',
                            })

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

                    {authRequested && authed === null &&
                        <div>
                            Auth: requested...
                        </div>
                    }
                    {authError &&
                        <div>
                            {JSON.stringify(authError, null, 4)}
                        </div>
                    }
                    {authed &&
                        <div>
                            Authed: {String(authed).toUpperCase()}
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

const mapStateToProps = ({
    login: {success, requested, form},
    auth: {success: authed, requested: authRequested, error: authError},
}) => ({
    success,
    requested,
    form,
    authed,
    authRequested,
    authError,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Register)
