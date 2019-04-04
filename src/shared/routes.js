import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/home'
import NotFound from './components/not-found'
import Status from './components/status'

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
