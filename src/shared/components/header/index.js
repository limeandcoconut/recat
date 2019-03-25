import * as React from 'react'
import {withNamespaces} from 'react-i18next'
import {NavLink, withRouter} from 'react-router-dom'
// import AuthLink from '../authlink/index'
// import GuestLink from '../guestlink'
import Authed from '../authed'
import Anon from '../anon'
import {connect} from 'react-redux'
import styles from './header.module.less'
import {requestLogout} from '../../store/logout/actions'

class Header extends React.Component {

    render() {
        const {t, success: authed, variant} = this.props
        let className = styles.header + ' '
        if (variant === 'a') {
            className += styles.headerA
        } else if (variant === 'b') {
            className += styles.headerB
        }
        return (
            <nav className={className} >
                <NavLink className={styles.navlink} to="/" exact>
                        Home
                </NavLink>
                <Authed>
                    <button className={styles.navlink + ' link unbutton'} onClick={this.props.requestLogout}>
                            Logout
                    </button>
                </Authed>
                {/* <Anon>
                    <NavLink className={styles.navlink} to="/register" exact>
                            Register
                    </NavLink>
                </Anon> | */}
                <Anon>
                    { this.props.location.pathname !== '/login' ? (
                        <NavLink className={styles.navlink} to="/login" exact>
                                login
                        </NavLink>
                    ) : (
                        <NavLink className={styles.navlink} to="/register" exact>
                                Register
                        </NavLink>
                    )}
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

const mapDispatchToProps = {
    requestLogout,
    // requestCat,
}

const mapStateToProps = ({auth: {success}}) => ({
    success,
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {pure: false},
)(withNamespaces()(Header)))
