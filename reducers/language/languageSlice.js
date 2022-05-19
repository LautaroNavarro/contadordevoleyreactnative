import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const initialState = {
  selected: 'en',
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    changeSelectedLanguage: (state, action) => {
      state.selected = action.payload;
    },
  },
});

const languagePersistConfig = {
  key: 'language',
  storage: AsyncStorage,
  whitelist: ['selected'],
};

export default persistReducer(languagePersistConfig, languageSlice.reducer);

export const {changeSelectedLanguage} = languageSlice.actions;

export const selectSelectedLanguage = state => state.language.selected;
