import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const initialState = {
  enabled: true,
};

export const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    changeEnabled: state => {
      state.enabled = !state.enabled;
    },
  },
});

const soundPersistConfig = {
  key: 'sound',
  storage: AsyncStorage,
  whitelist: ['enabled'],
};

export default persistReducer(soundPersistConfig, soundSlice.reducer);

export const {changeEnabled} = soundSlice.actions;

export const selectSoundEnabled = state => state.sound.enabled;
