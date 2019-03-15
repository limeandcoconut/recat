import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import app from './app/reducer'
import cats from './cats/reducer'

const createRootReducer = (history) => combineReducers({
    app,
    cats,
    router: connectRouter(history),
})

export default createRootReducer
