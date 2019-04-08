import * as React from 'react'
import {Redirect, Route, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {requestAuth} from '../../store/auth/actions'

class AuthRoute extends React.Component {

    componentDidMount() {
        this.props.requestAuth()
    }
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

const mapStateToProps = ({auth: {success}}) => ({
    isAuthed: success,
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthRoute))
