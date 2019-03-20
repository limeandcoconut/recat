import * as React from 'react'
import {withNamespaces} from 'react-i18next'
import {Redirect, NavLink, Switch, Route, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import {requestAuth} from '../../store/auth/actions'
// import css from './input.module.css'

class AuthRoute extends React.Component {
    // state = {
    //     loaded: false,
    //     isAuthed: false
    // }
    componentDidMount() {
        this.props.requestAuth()
        // this.authenticate()
        // this.unlisten = this.props.history.listen(() => {
        //     Auth.currentAuthenticatedUser()
        //         .then(user => console.log('user: ', user))
        //         .catch(() => {
        //             if (this.state.isAuthed) this.setState({isAuthed: false})
        //         })
        // });
    }
    // componentWillUnmount() {
    //     this.unlisten()
    // }
    // authenticate() {
    // Auth.currentAuthenticatedUser()
    //     .then(() => {
    //         this.setState({loaded: true, isAuthenticated: true})
    //     })
    //     .catch(() => this.props.history.push('/auth'))
    // }
    render() {
        const {component: Component, to = '/login', isAuthed, ...rest} = this.props

        if (isAuthed === null) {
            return null
        }

        return (
            <Route
                {...rest}
                render={(props) => {
                    return isAuthed ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: to,
                            }}
                        />
                    )
                }}
            />
        )
    }
}

const mapDispatchToProps = {
    requestAuth,
}

// TODO: Decide if defaults are needed
const mapStateToProps = ({auth: {success}}) => ({
    isAuthed: success,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withNamespaces()(AuthRoute)))
