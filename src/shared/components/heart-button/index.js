import * as React from 'react'
import styles from './heart-button.module.less'
import {connect} from 'react-redux'

class HeartButton extends React.Component {

    render() {
        let {favorite, requested, className, active, onClick} = this.props
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
                        </clipPath>
                    </defs>
                </svg>
                {/* <div className={styles.outline} ></div> */}
                <div
                    className={styles.favorite}
                    style={{backgroundImage: `url(${favorite})`}}
                >
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({favorite: {favorite, get: {requested: getRequested}, put: {requested: putRequested}}}) => ({
    favorite,
    requested: getRequested || putRequested,
})

export default connect(
    mapStateToProps,
)(HeartButton)
