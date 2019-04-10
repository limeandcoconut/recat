import * as React from 'react'
// import Register from './pages/register'
// import Login from './pages/login'
import Home from './pages/home'
import NotFound from './components/not-found'
import Status from './components/status'

// import Async from 'react-code-splitting'
// import Async from './components/async'

// const Home = () => <Async load={import(/* webpackPrefetch: true */ './pages/home')} />

// const home = () => import(/* webpackChunkName: "home" */ './modules/home/index');

// <Route path='/' exact={true} component={() => <AsyncComponent moduleProvider={home} />} />

import {asyncComponent} from 'react-async-component'

// const Home = asyncComponent({
//     resolve: () => import('./pages/home'),
// })

const Login = asyncComponent({
    resolve: () => import(/* webpackChunkName: "chunk1", webpackPrefetch: true */ './pages/login'),
})

const Register = asyncComponent({
    resolve: () => import(/* webpackChunkName: "chunk1", webpackPrefetch: true */ './pages/register'),
})

export default [
    {
        path: '/',
        exact: true,
        component: Home,
    },
    {
        path: '/register',
        exact: true,
        component: Register,
    },
    {
        path: '/login',
        exact: true,
        component: Login,
    },
    {
        path: '/418',
        exact: true,
        component: Status,
    },
    {
        path: '/*',
        component: NotFound,
    },
]
