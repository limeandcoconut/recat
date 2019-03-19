// import AppRoot  from './containers/AppRoot'
// import App from './App'
import Page1 from './pages/Page-1'
import Register from './pages/register'
// import login from './pages/login'
// import { NotFound } from './components/NotFound'

export default [
    {
        path: '/',
        exact: true,
        component: Page1,
    },
    {
        path: '/page1',
        exact: true,
        component: Page1,
    },
    {
        path: '/register',
        exact: true,
        component: Register,
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
