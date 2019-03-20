import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import app from './app/reducer'
import cats from './cats/reducer'
import auth from './auth/reducer'
import login from './login/reducer'
import registration from './registration/reducer'

const createRootReducer = (history) => combineReducers({
    app,
    cats,
    auth,
    login,
    registration,
    router: connectRouter(history),
})

export default createRootReducer
