import * as React from 'react'
import {withNamespaces} from 'react-i18next'
// import css from './input.module.css'

class Input extends React.Component {

    render() {
        const {t, name, value, type = 'text'} = this.props
        return (
            <label>
                {name}
                <input type={type} name={name} value={value} onChange={this.props.onChange} required/>
            </label>
        )
    }
}
export default withNamespaces()(Input)
