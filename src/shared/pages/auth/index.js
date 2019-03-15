import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {toggleLogin} from '../../store/auth/actions'
// import {PureComponent} from './assets/react.svg'
// import Features from './components/Features';
// import css from './.module.css'
// import {Switch, Route} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
// import {renderRoutes} from 'react-router-config'
import Register from '../../components/register'
// import routes from '../shared/routes'
// import PrivateRoute from './components/PrivateRoute'

class Auth extends React.Component {

    render() {
        const {showLogin} = this.props

        return (
            <div>
                {
                    showLogin ? (
                        <div>coming soon: Login</div>
                    ) : (
                        <Register />
                    )
                }
                <div>
                    <button onClick={this.props.toggleLogin}>
                        {
                            showLogin ? (
                                'Register'
                            ) : (
                                'Login'
                            )
                        }
                    </button>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    toggleLogin,
}

const mapStateToProps = ({auth: {showLogin} = {}} = {}) => ({
    showLogin,
})

// const mapStateToProps = (state) => {
//     console.log('state')
//     console.log('state')
//     console.log('state')
//     console.log(state)
//     console.log(state.auth)
//     console.log(state.auth.showLogin)
//     return {state.auth.showLogin
// }

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Auth)
