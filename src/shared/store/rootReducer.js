import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import createHistory from './history'
import app from './app/reducer'
import cats from './cats/reducer'

const history = createHistory()

const rootReducer = combineReducers({
    app,
    cats,
    router: connectRouter(history),
})

export default rootReducer
