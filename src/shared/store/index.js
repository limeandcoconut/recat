// import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import {createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

export const configureStore = ({initialState, middleware = []} = {}) => {
    const devtools =
        typeof window !== 'undefined' &&
        typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({actionsBlacklist: []})

    const composeEnhancers = devtools || compose

    const sagaMiddleware = createSagaMiddleware()

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(...[sagaMiddleware].concat(...middleware)))
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
