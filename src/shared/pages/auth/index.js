import * as React from 'react'
import {connect} from 'react-redux'
import {toggleLogin} from '../../store/auth/actions'
import Register from '../../components/register'

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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Auth)
