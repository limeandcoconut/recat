import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {requestCat} from '../../store/cats/actions'
import Input from '../../components/input'
import styles from './home.module.less'
import Beater from '../../components/beater'
import {withRouter, Redirect, Link} from 'react-router-dom'

import Confetti from 'react-dom-confetti'

const confettiConfig = {
    angle: '90',
    spread: '91',
    startVelocity: '31',
    elementCount: '26',
    dragFriction: '0.25',
    duration: '1010',
    delay: '4',
    width: '10px',
    height: '9px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
}
// return <Confetti active={ someProp } config={ config }/>

class Home extends React.Component {
    // setLanguage = (e) => {
    //     //this.store.dispatch(setLocale(e.target.value))
    //     this.props.setLocale(e.target.value);
    // };

    componentDidMount() {
        if (!this.props.src && this.props.authed) {
            this.props.requestCat()
        }
    }

    fillMessage = (message) => <div className={styles.message} >{message}</div>

    formatMessage() {
        const {authed, requested, error, src} = this.props
        const fillMessage = this.fillMessage
        if (src) {
            return <br className={styles.messagePlaceholder} />
        }
        if (requested) {
            return fillMessage('Requested...')
        }
        if (error) {
            return fillMessage(error)
        }
        return fillMessage('Request a kitty cat!')
    }

    render() {
        const {authed, requested, error, src} = this.props

        if (!authed) {
            return (
                <div className={styles.wrapperGuest} >
                    This is an app for fawning over kitty cats.
                    <br/>
                    <br/>
                    Login to participate.
                    <br/>
                    <br/>
                    <div className={styles.cat} >
                        😻
                    </div>
                </div>
            )
        }

        return (
            <div className={styles.wrapper} >
                <div className={styles.imageContainer} >
                    {src ?
                        <img
                            src={src}
                            className={styles.image}
                            alt="A pic of the bestest kitty cat evar!"
                        />
                        :
                        <div className={styles.imagePlaceholder}></div>
                    }
                    {requested && (
                        <Beater className={styles.beater}/>
                    )}
                </div>
                <Confetti active={src && requested} config={confettiConfig} className={styles.confetti} />
                <button className={styles.button} onClick={this.props.requestCat} disabled={requested}>Request a Cat</button>
            </div>
        )
    }
}

const mapDispatchToProps = {
    requestCat,
}

const mapStateToProps = ({auth: {success: authed}, cats: {requested, error, src}}) => ({
    authed,
    requested,
    error,
    src,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Home)
