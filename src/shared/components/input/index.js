import * as React from 'react'
import styles from './input.module.less'

class Input extends React.Component {
    defaultValue = {
        number: 0,
    }

    render() {
        const {name, value, type = 'text', className = '', disabled = false, required = true} = this.props
        let defaultValue = this.defaultValue[type]
        defaultValue = typeof defaultValue !== 'undefined' ? defaultValue : ''
        const filled = value === defaultValue ? defaultValue : styles.inputFilled

        return (
            <label className={`${styles.wrapper} ${className}`}>
                {name}
                <input
                    type={type}
                    name={name}
                    value={value}
                    className={`${styles.input} ${filled}`}
                    onChange={this.props.onChange}
                    required={required}
                    disabled={disabled}
                />
                <div className={styles.inputBgRaw}><br/></div>
                <div className={styles.inputBgFocus}><br/></div>
            </label>
        )
    }
}
export default Input
