import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
  connected: false,
  error: null,
  topics: [],
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    socketConnected: state => {
      state.connected = true;
      state.topics = [];
    },
    socketDisconnected: state => {
      state.connected = false;
    },
    socketSubscribe: (state, action) => {
      state.topics.push(action.payload);
    },
    socketError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export default socketSlice.reducer;

export const {socketConnected, socketDisconnected, socketSubscribe, socketError} = socketSlice.actions;

export const selectSocketConnected = state => state.socket.connected;
