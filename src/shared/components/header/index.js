import * as React from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import Authed from '../authed'
import Anon from '../anon'
import {connect} from 'react-redux'
import styles from './header.module.less'
import {requestLogout} from '../../store/logout/actions'

class Header extends React.Component {

    render() {
        const {variant} = this.props
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
                <Anon>
                    { this.props.location.pathname !== '/login' ? (
                        <NavLink className={styles.navlink} to="/login" exact>
                                Login
                        </NavLink>
                    ) : (
                        <NavLink className={styles.navlink} to="/register" exact>
                                Register
                        </NavLink>
                    )}
                </Anon>
            </nav>
        )
    }
}

const mapDispatchToProps = {
    requestLogout,
}

export default withRouter(connect(
    null,
    mapDispatchToProps,
    null,
    {pure: false},
)(Header))
