import * as React from 'react'
import styles from './toast.module.less'
import {connect} from 'react-redux'
import {hideToast} from '../../store/toast/actions'
import {withRouter} from 'react-router-dom'

class Toast extends React.Component {
    componentDidMount() {
        this.unlisten = this.props.history.listen(this.props.hideToast)
    }

    componentWillUnmount() {
        this.unlisten()
    }

    render() {
        let {display, style, message, hideToast} = this.props
        const styleClass = styles[style] || ''
        const displayClass = display ? styles.display : ''
        const defaultMessage = 'something went wrong'
        if (typeof message !== 'string') {
            if (process.env.NODE_ENV === 'development') {
                console.log(message)
            }
            message = defaultMessage
        }
        return (
            <div
                className={`${styles.container} ${displayClass} ${styleClass}`}
                onClick={hideToast}
            >
                <div className={styles.message}>{message}</div>
                <div className={styles.x}>&times;</div>
            </div>
        )
    }
}

const mapStateToProps = ({toast: {display, message, style}}) => ({
    display,
    message,
    style,
})

const matchDispatchToProps = {
    hideToast,
}

export default withRouter(connect(
    mapStateToProps,
    matchDispatchToProps,
)(Toast))
