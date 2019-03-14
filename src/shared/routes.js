// import AppRoot  from './containers/AppRoot'
// import App from './App'
import Page1 from './pages/Page-1'
import Page2 from './pages/Page-2'
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
        path: '/page2',
        exact: true,
        component: Page2,
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
