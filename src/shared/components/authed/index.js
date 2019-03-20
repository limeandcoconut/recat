import * as React from 'react'
import {connect} from 'react-redux'
// import css from './input.module.css'

const Authed = ({authed, children}) => authed ? children : null

const mapStateToProps = ({auth: {success}}) => ({
    authed: success,
})

export default connect(mapStateToProps)(Authed)
