import * as React from 'react'
// import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {requestCat} from '../../store/cats/actions'
import Input from '../../components/input'
// import css from './App.module.css'
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

    fillMessage = (message) => <div>{message}</div>

    formatMessage() {
        const {authed, catRequested, catError, catSrc} = this.props
        const fillMessage = this.fillMessage
        if (catSrc) {
            return null
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
            <div /* className={css.wrapper} */>
                {catSrc &&
                    <div>
                        <img src={catSrc} className="cat-pic" alt="A pic of the bestest kitty cat evar!" />
                        <p className="App-intro">Keep clicking for new cats</p>
                    </div>
                }
                {this.formatMessage()}
                {catRequested ?
                    <button disabled>Fetching...</button> :
                    <button onClick={this.props.requestCat}>Request a Cat</button>
                }

            </div>
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
