import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import toast from './toast/reducer'
import app from './app/reducer'
import cats from './cats/reducer'
import auth from './auth/reducer'
import login from './login/reducer'
import logout from './logout/reducer'
import registration from './registration/reducer'

const createRootReducer = (history) => combineReducers({
    toast,
    app,
    cats,
    auth,
    login,
    logout,
    registration,
    router: connectRouter(history),
})

export default createRootReducer
