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
        const {display, style, message, hideToast, history} = this.props
        const styleClass = styles[style] || ''
        const displayClass = display ? styles.display : ''
        console.log(history)
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