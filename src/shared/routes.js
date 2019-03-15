// import AppRoot  from './containers/AppRoot'
// import App from './App'
import Page1 from './pages/Page-1'
import Auth from './pages/auth'
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
        component: Auth,
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
