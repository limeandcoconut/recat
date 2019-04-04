import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import toast from './toast/reducer'
import app from './app/reducer'
import webp from './webp/reducer'
import favorite from './favorite/reducer'
import cats from './cats/reducer'
import auth from './auth/reducer'
import login from './login/reducer'
import logout from './logout/reducer'
import registration from './registration/reducer'

const createRootReducer = (history) => combineReducers({
    toast,
    app,
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
