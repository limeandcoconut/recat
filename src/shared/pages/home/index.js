import * as React from 'react'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
// import { withNamespaces } from 'react-i18next';
// import { setLocale } from './store/app/actions';
import {requestCat} from '../../store/cats/actions'
import {putFavorite, requestFavorite} from '../../store/favorite/actions'
import styles from './home.module.less'
import Beater from '../../components/beater'
import {productionHost} from '../../../../config/config.js'
import Confetti from 'react-dom-confetti'
import HeartButton from '../../components/heart-button'

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
    colors: ['#7a59e2', '#06aed5', '#1fe9ae', '#da1b60', '#ff8a00'],
}

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.saveFavorite = this.saveFavorite.bind(this)
        this.toggleSource = this.toggleSource.bind(this)
        this.getNewCat = this.getNewCat.bind(this)
        this.state = {
            useFavorite: false,
        }
    }
    // setLanguage = (e) => {
    //     //this.store.dispatch(setLocale(e.target.value))
    //     this.props.setLocale(e.target.value);
    // };

    componentDidMount() {
        this.checkIfAuthed()
    }

    componentDidUpdate() {
        this.checkIfAuthed()
    }

    checkIfAuthed() {
        if (!this.props.image && this.props.authed && !this.props.requested && !this.props.error) {
            this.props.requestCat()
            this.props.requestFavorite()
        }
    }

    saveFavorite() {
        this.props.putFavorite(this.props.id)
        this.props.requestCat()
    }

    toggleSource() {
        this.setState({
            useFavorite: !this.state.useFavorite,
        })
    }

    getNewCat() {
        this.props.requestCat()
        if (this.state.useFavorite) {
            this.toggleSource()
        }
    }

    render() {
        const {authed, requested, image, favorite} = this.props

        const helmet = <Helmet>
            <link rel="canonical" href={productionHost} />
        </Helmet>

        if (!authed) {
            return (
                <div className={styles.wrapperGuest} >
                    {helmet}
                    This is an app for fawning over kitty cats.
                    <br/>
                    <br/>
                    Log in to participate.
                    <br/>
                    <br/>
                    <div className={styles.cat} >
                        😻
                    </div>
                </div>
            )
        }

        const src = this.state.useFavorite ? favorite : image

        return (
            <div className={styles.wrapper} >
                {helmet}
                <div className={styles.imageContainer} >
                    {image && image.length ?
                        <>
                            <img
                                src={src}
                                className={styles.image}
                                alt="A pic of the bestest kitty cat evar!"
                            />
                            <div className={styles.imageFooter} >
                                <button
                                    className={styles.favoriteButton}
                                    onClick={this.saveFavorite}
                                    disabled={this.state.useFavorite}
                                >
                                    ZOMG
                                    <br/>
                                    FAV!
                                </button>
                                <HeartButton
                                    className={styles.heartButton}
                                    onClick={this.toggleSource}
                                    active={this.state.useFavorite}
                                />
                            </div>
                        </>
                        :
                        <div className={styles.imagePlaceholder}></div>
                    }
                    {requested && (
                        <Beater className={styles.beater}/>
                    )}
                </div>
                <Confetti active={image && image.length && requested} config={confettiConfig} className={styles.confetti} />
                <button className={styles.button} onClick={this.getNewCat} disabled={requested}>Request a Cat</button>
            </div>
        )
    }
}

const mapDispatchToProps = {
    requestCat,
    putFavorite,
    requestFavorite,
}

const mapStateToProps = ({auth: {success: authed}, cats: {requested, error, image, id}, favorite: {favorite}}) => {
    return ({
        authed,
        requested,
        error,
        image,
        id,
        favorite,
    })
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {pure: false}
)(Home)
