import * as React from 'react'
// import LoadingIndicator from 'commons/ui/components/LoadingIndicator';

// export default class AsyncComponent extends PureComponent {
//     constructor(props) {
//         super(props)

//         this.state = {
//             Component: null,
//         }
//     }

//     componentWillMount() {
//         if (!this.state.Component) {
//             this.props.moduleProvider().then(({Component}) => this.setState({Component}))
//         }
//     }

//     render() {
//         const {Component} = this.state

//         // The magic happens here!
//         return (
//             <div>
//                 {Component ? <Component /> : 'loading...'}
//             </div>
//         )
//     }
// }

// import * as React from 'react'
// import PropTypes from 'prop-types'

export default class Async extends React.Component {
    componentWillMount = () => {
        this.cancelUpdate = false
        this.props.load.then((component) => {
            this.Component = component
            if (!this.cancelUpdate) {
                this.forceUpdate()
            }
        })
    }

    componentWillUnmount = () => {
        this.cancelUpdate = true
    }

    render = () => {
        const {componentProps} = this.props
        if (!this.Component.Component) {
            return null
        }

        const Component = this.Component.default ? this.Component.default : this.Component

        return <Component {...componentProps} />
    }
}

// Async.propTypes = {
//   load: PropTypes.instanceOf(Promise).isRequired,
// }
