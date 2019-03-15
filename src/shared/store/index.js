// import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import {createStore, applyMiddleware, compose} from 'redux'
import createRootReducer from './rootReducer'
import {routerMiddleware} from 'connected-react-router'
import rootSaga from './rootSaga'
// import createHistory from '../../shared/store/history'

export const configureStore = ({initialState = {}, middleware = [], history} = {}) => {
    const devtools =
        typeof window !== 'undefined' &&
        typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({actionsBlacklist: []})

    const composeEnhancers = devtools || compose

    const sagaMiddleware = createSagaMiddleware()

    const store = createStore(
        createRootReducer(history),
        initialState,
        composeEnhancers(applyMiddleware(...[sagaMiddleware, routerMiddleware(history)].concat(...middleware)))
    )

    sagaMiddleware.run(rootSaga)

    if (process.env.NODE_ENV !== 'production') {
        if (module.hot) {
            module.hot.accept('./rootReducer', () =>
                store.replaceReducer(require('./rootReducer').default)
            )
        }
    }

    return store
}

export default configureStore
