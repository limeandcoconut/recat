import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import toast from './toast/reducer'
import webp from './webp/reducer'
import favorite from './favorite/reducer'
import cats from './cats/reducer'
import auth from './auth/reducer'
import login from './login/reducer'
import logout from './logout/reducer'
import registration from './registration/reducer'

/**
 * Runs connectRouter and combineReducers.
 * @function createRootReducer
 * @param  {object} history A history to provide the router.
 * @return {object} The root reducer for the store.
 */
const createRootReducer = (history) => combineReducers({
    toast,
    cats,
    webp,
    favorite,
    auth,
    login,
    logout,
    registration,
    router: connectRouter(history),
})

export default createRootReducer
