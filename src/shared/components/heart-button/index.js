import * as React from 'react'
import styles from './heart-button.module.less'

import {connect} from 'react-redux'
// import {hideToast} from '../../store/toast/actions'
// import {r} from '../../store/favorite/actions'
// import {withRouter} from 'react-router-dom'

class HeartButton extends React.Component {
    // constructor(props) {
    //     super(props)
    //     this.active = false
    // }

    // componentDidMount() {
    //     if (this.node && this.onClick) {
    //         document.addEventListener('click', this.handleClick, false)
    //     }
    // }

    // componentWillUnmount() {
    //     document.removeEventListener('click', this.handleClick, false)
    // }

    // handleClick = (event) => {
    //     if (this.node.contains(event.target)) {
    //         event.preventDefault()
    //         this.active = !this.active
    //         return
    //     }
    //     if (!this.active) {
    //         return
    //     }
    //     event.preventDefault()
    //     this.active = false
    // }

    render() {
        let {favorite, requested, className, active, onClick} = this.props
        // favorite = 'https://placebear.com/300/300'
        if (!favorite) {
            return null
        }
        const activeClass = active ? styles.active : ''
        const loadingClass = requested ? styles.loading : ''
        return (
            <div
                ref={(node) => {
                    this.node = node
                }}
                onClick={onClick}
                className={`${styles.container} ${activeClass} ${loadingClass} ${className}`}
            >
                <svg className={styles.defs}>
                    <defs>
                        <clipPath id="favorite-button-clip-path" clipPathUnits="objectBoundingBox">
                            <path
                                id="heart"
                                d="M0.8269266666666667,0.01961c-0.12230333333333335-0.04913-0.25923666666666667-0.0027966666666666665-0.32838999999999996,0.10375C0.42939000000000005,0.016813333333333333,0.29245-0.02952,0.17014333333333334,0.01961 C0.031179999999999996,0.07544000000000001-0.03621,0.23336333333333334,0.019623333333333333,0.37232c0.05353333333333333,0.13326666666666664,0.4777133333333333,0.46535666666666664,0.4777133333333333,0.46535666666666664l0.0011966666666666666,0.0009333333333333334l0.0012-0.0009333333333333334 c0,0,0.42417-0.33209,0.4777133333333333-0.46535666666666664C1.0332866666666667,0.23336333333333334,0.9658933333333333,0.07544000000000001,0.8269266666666667,0.01961z"
                                fill="#fffdf8"
                            />
                            {/* <path d="M2.48078,0.05883c-0.36691-0.14739000000000002-0.77771-0.00839-0.98517,0.31125C1.28817,0.05044,0.87735-0.08856,0.5104299999999999,0.05883 C0.09354,0.22632000000000002-0.10862999999999999,0.70009,0.05887,1.11696c0.1606,0.3998,1.4331399999999999,1.39607,1.4331399999999999,1.39607l0.00359,0.0028000000000000004l0.0036-0.0028000000000000004 c0,0,1.27251-0.99627,1.4331399999999999-1.39607C3.09986,0.70009,2.89768,0.22632000000000002,2.48078,0.05883z"/> */}
                            {/* <path d="M248.078,5.883c-36.691-14.739-77.771-0.839-98.517,31.125C128.817,5.044,87.735-8.856,51.043,5.883 C9.354,22.632-10.863,70.009,5.887,111.696c16.06,39.98,143.314,139.607,143.314,139.607l0.359,0.28l0.36-0.28 c0,0,127.251-99.627,143.314-139.607C309.986,70.009,289.768,22.632,248.078,5.883z"/> */}
                        </clipPath>
                    </defs>
                </svg>
                {/* <div className={styles.outline} ></div> */}
                <div
                    className={styles.favorite}
                    // styles={`background: url(${'"https://placebear.com/300/300"'});`}
                    style={{backgroundImage: `url(${favorite})`}}
                >
                </div>
                {/* <img
                    src={'https://placebear.com/300/300'}
                    // src={favorite}
                    className={styles.favorite}
                    alt="A pic of the bestest kitty cat evar!"
                /> */}
            </div>
        )
    }
}

const mapStateToProps = ({favorite: {favorite, get: {getRequested}, put: {putRequested}}}) => ({
    favorite,
    requested: getRequested || putRequested,
})

// const matchDispatchToProps = {

// }

export default connect(
    mapStateToProps,
    // matchDispatchToProps,
)(HeartButton)
