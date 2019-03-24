import * as React from 'react'
import {withNamespaces} from 'react-i18next'
import styles from './input.module.less'

class Input extends React.Component {
    defaultValue = {
        number: 0,
    }

    render() {
        const {t, name, value, type = 'text', className = ''} = this.props
        let defaultValue = this.defaultValue[type]
        defaultValue = typeof defaultValue !== 'undefined' ? defaultValue : ''
        const filled = value === defaultValue ? defaultValue : styles.inputFilled

        return (
            <label className={`${styles.wrapper} ${className}`}>
                {name}
                <input type={type} name={name} value={value} className={`${styles.input} ${filled}`} onChange={this.props.onChange} required/>
                <div className={styles.inputBgBefore}><br/></div>
                <div className={styles.inputBgAfter}><br/></div>
            </label>
        )
    }
}
export default withNamespaces()(Input)
