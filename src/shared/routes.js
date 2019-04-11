import * as React from 'react'
import Home from './pages/home'
import NotFound from './components/not-found'
import Status from './components/status'

import {asyncComponent} from 'react-async-component'

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
