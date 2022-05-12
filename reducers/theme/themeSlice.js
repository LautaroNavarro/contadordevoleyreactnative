import {createSlice} from '@reduxjs/toolkit';
import {DarkTheme, DefaultTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const StyledDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#d8358d',
    accent: '#d8358d',
    secondaryBackground: '#1E1E1E',
  },
};

const StyledLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#d8358d',
    accent: '#d8358d',
    secondaryBackground: '#DEDEDE',
  },
};

const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

const initialState = {
  theme: DARK_THEME,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: state => {
      state.theme = state.theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    },
  },
});

const themePersistConfig = {
  key: 'theme',
  storage: AsyncStorage,
  whitelist: ['theme'],
};

export default persistReducer(themePersistConfig, themeSlice.reducer);

export const {changeTheme} = themeSlice.actions;

export const selectTheme = state => (state.theme.theme === DARK_THEME ? StyledDarkTheme : StyledLightTheme);
export const selectIsDarkTheme = state => state.theme.theme === DARK_THEME;
