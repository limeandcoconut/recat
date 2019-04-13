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
