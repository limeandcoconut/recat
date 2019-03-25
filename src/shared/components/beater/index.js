import * as React from 'react'
import styles from './beater.module.less'

const Beater = ({display = true, className = ''}) => {
    if (!display) {
        return null
    }

    return (
        <div className={`${styles.wrapper} ${className}`} >
            <div className={styles.beater}></div>
        </div>
    )
}

export default Beater
