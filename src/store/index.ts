import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import reducers from 'src/store/modules/rootReducer';
import sagas from 'src/store/modules/rootSaga';
import { router } from '../screens/routes';

const persistConfig = {
  key: 'root',
  timeout: 0,
  storage,
  whitelist: ['auth'],
};

const middlewares = [];

const sagaMonitor =
  import.meta.env.NODE_ENV === 'development'
    ? console.tron.createSagaMonitor()
    : null;

const sagaMiddleware = createSagaMiddleware({
  sagaMonitor,
});

sagaMiddleware.setContext({
  router: router,
});

middlewares.push(sagaMiddleware);

const composer =
  import.meta.env.NODE_ENV === 'development'
    ? compose(applyMiddleware(...middlewares), console.tron.createEnhancer())
    : compose(applyMiddleware(...middlewares));

const persistedReducer = persistReducer(persistConfig, reducers());

const store = createStore(persistedReducer, composer);

sagaMiddleware.run(sagas);

const persistor = persistStore(store);

export { store, persistor };
