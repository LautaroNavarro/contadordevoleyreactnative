import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import test from './test/testSlice';
import match from './match/matchSlice';
import socket from './socket/socket.slice';
import socketMiddleware from './socket/socket.middleware';
import settings from './settings/settingsSlice';

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: false,
  }),
  socketMiddleware(),
  	// We need to add the websocket middleware here
];

const rootReducer = combineReducers({
	socket,
  test,
  match,
  settings,
});

export const createStore = initialState =>
  configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware,
});
