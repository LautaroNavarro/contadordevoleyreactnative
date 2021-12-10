import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import test from './test/testSlice';

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: false,
  }),
  	// We need to add the websocket middleware here
];

const rootReducer = combineReducers({
	test,
});

export const createStore = initialState =>
  configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware,
});
