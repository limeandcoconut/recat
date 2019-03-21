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
        const {t, success: authed} = this.props
        return (
            <nav className={styles.header} >
                <NavLink className={styles.navlink} to="/">
                        Home
                </NavLink>
                <Authed>
                    <button className={styles.navlink + ' link unbutton'} onClick={this.props.requestLogout}>
                            Logout
                    </button>
                </Authed>
                {/* <Anon>
                    <NavLink className={styles.navlink} to="/register">
                            Register
                    </NavLink>
                </Anon> | */}
                <Anon>
                    { this.props.location.pathname !== '/login' ? (
                        <NavLink className={styles.navlink} to="/login">
                                Login
                        </NavLink>
                    ) : (
                        <NavLink className={styles.navlink} to="/register">
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
)(withNamespaces()(Header)))
