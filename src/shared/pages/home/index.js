import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {requestCat} from '../../store/cats/actions'
import Input from '../../components/input'
import styles from './home.module.less'
import {withRouter, Redirect, Link} from 'react-router-dom'

class Home extends React.Component {
    // setLanguage = (e) => {
    //     //this.store.dispatch(setLocale(e.target.value))
    //     this.props.setLocale(e.target.value);
    // };

    componentDidMount() {
        if (!this.props.catSrc && this.props.authed) {
            this.props.requestCat()
        }
    }

    fillMessage = (message) => <div  className={styles.message} >{message}</div>

    formatMessage() {
        const {authed, catRequested, catError, catSrc} = this.props
        const fillMessage = this.fillMessage
        if (catSrc) {
            return <br  className={styles.messagePlaceholder} />
        }
        if (catRequested) {
            return fillMessage('Requested...')
        }
        if (catError) {
            return fillMessage(catError)
        }
        return fillMessage('Request a kitty cat!')
    }

    render() {
        const {authed, catRequested, catError, catSrc} = this.props

        if (!authed) {
            return (
                <div>
                    This is an app for viewing kitty cats.
                    Login to participate
                </div>
            )
        }

        return (
            // <div /* className={styles.wrapper} */>
            <>
                {catSrc &&
                    <div className={styles.imageContainer} >
                        <img 
                            src={catSrc} 
                            className={styles.image}
                            alt="A pic of the bestest kitty cat evar!" 
                        />
                    </div>

                }
                {this.formatMessage()}
                <div className={styles.buttonContainer} >
                    {catRequested ?
                        <button className={styles.button} disabled>Fetching...</button> :
                        <button className={styles.button} onClick={this.props.requestCat}>Request a Cat</button>
                    }
                </div>
            </>
            // </div>
        )
    }
}

const mapDispatchToProps = {
    requestCat,
}

const mapStateToProps = ({auth: {success: authed}, cats: {requested: catRequested, error: catError, src: catSrc}}) => ({
    authed,
    catRequested,
    catError,
    catSrc,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Home)
