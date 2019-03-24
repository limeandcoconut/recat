import * as React from 'react'
import styles from './beater.module.less'

const Beater = ({display = true}) => {
    if (!display) {
        return null
    }
    return <div className={styles.beater}></div>
}

export default Beater
