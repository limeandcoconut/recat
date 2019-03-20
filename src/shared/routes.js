// import AppRoot  from './containers/AppRoot'
// import App from './App'
import Page1 from './pages/Page-1'
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/home'
// import { NotFound } from './components/NotFound'

export default [
    {
        path: '/',
        exact: true,
        component: Home,
    },
    {
        path: '/page1',
        exact: true,
        component: Page1,
        auth: true,
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
    // { path: '*',
    //   component: NotFound
    // },
]

// export default [
//     {
//         path: "/",
//         component: Home,
//         exact: true,
//     },
//     {
//         path: "/about",
//         component: About,
//         exact: true,
//     },
//     {
//         path: "/contact",
//         component: Contact,
//         exact: true,
//     },
//     {
//         path: "/secret",
//         component: Secret,
//         exact: true,
//     },
// ];
