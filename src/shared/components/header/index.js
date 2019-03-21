import * as React from 'react'
import {withNamespaces} from 'react-i18next'
import {NavLink, Switch, Route} from 'react-router-dom'
// import AuthLink from '../authlink/index'
// import GuestLink from '../guestlink'
import Authed from '../authed'
import Anon from '../anon'
import {connect} from 'react-redux'
// import css from './input.module.css'

class Header extends React.Component {

    render() {
        const {t, success: authed} = this.props
        return (
            <nav>
                <NavLink to="/">
                        Home
                </NavLink>|
                <Authed>
                    <NavLink to="/page1">
                            page 1
                    </NavLink>|
                </Authed>
                <Anon>
                    <NavLink to="/register">
                            Register
                    </NavLink>
                </Anon> |
                <Anon>
                    <NavLink to="/login">
                            Login
                    </NavLink>
                </Anon>

                {/* <AuthLink nav="true" to="/page1">
                        page 1
                </AuthLink>|

                <GuestLink nav="true" to="/register">
                            Register
                </GuestLink>
                        |
                <GuestLink nav="true" to="/login">
                            Login
                </GuestLink> */}
            </nav>
        )
    }
}

const mapStateToProps = ({auth: {success}}) => ({
    success,
})

export default connect(mapStateToProps)(withNamespaces()(Header))
