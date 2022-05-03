import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import match from './match/matchSlice';
import theme from './theme/themeSlice';
import sound from './sound/soundSlice';
import socket from './socket/socket.slice';
import socketMiddleware from './socket/socket.middleware';

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: false,
  }),
  socketMiddleware(),
  	// We need to add the websocket middleware here
];

const rootReducer = combineReducers({
	socket,
  match,
  theme,
  sound,
});

export const createStore = initialState =>
  configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware,
});
