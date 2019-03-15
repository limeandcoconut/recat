import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import app from './app/reducer'
import cats from './cats/reducer'
import auth from './auth/reducer'

const createRootReducer = (history) => combineReducers({
    app,
    cats,
    auth,
    router: connectRouter(history),
})

export default createRootReducer
