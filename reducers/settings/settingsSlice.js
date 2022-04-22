import { createSlice } from '@reduxjs/toolkit';
import { DarkTheme, DefaultTheme } from 'react-native-paper';

const DARK_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#d8358d',
  },
};

const LIGHT_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#d8358d',
  },
};

const initialState = {
  sound: true,
  darkMode: true,
  selectedTheme: DARK_THEME,
};

export const matchSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSound: (state, action) => {
      state.sound = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      if (action.payload) {
        state.selectedTheme = DARK_THEME;
      } else {
        state.selectedTheme = LIGHT_THEME;
      }
    },
  }
});

export default matchSlice.reducer;

export const { setSound, setDarkMode } = matchSlice.actions;

export const selectSound = state => state.settings.sound;
export const selectDarkMode = state => state.settings.darkMode;
export const selectSelectedTheme = state => state.settings.selectedTheme;

