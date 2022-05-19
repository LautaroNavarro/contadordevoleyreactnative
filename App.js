import {useSelector, Provider, useDispatch} from 'react-redux';
import React, {useEffect} from 'react';
import {ThemeProvider} from 'styled-components';
import {Dimensions} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {enableScreens} from 'react-native-screens';
// eslint-disable-next-line
import * as ScreenOrientation from 'expo-screen-orientation';
import {useTranslation} from 'react-i18next';

import TranslationProvider from './translations';
import {selectTheme} from './reducers/theme/themeSlice';
import {setIsPortrait} from './reducers/responsive/responsiveSlice';
import Home from './screens/Home';
import NewMatch from './screens/NewMatch/NewMatch';
import Match from './screens/Match/Match';
import {createStore} from './reducers/root';
import DrawerComponent from './components/Drawer/Drawer';
import Spinner from './components/Spinner/Spinner';

enableScreens(false);

axios.defaults.baseURL = 'https://contadordevoleybejs.herokuapp.com/';

const Drawer = createDrawerNavigator();
const store = createStore();
const persistor = persistStore(store);

const AppComponent = () => {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const screenStyle = {
    headerShown: true,
    headerTintColor: theme.colors.text,
  };
  const {t} = useTranslation();

  useEffect(() => {
    const dim = Dimensions.get('screen');
    dispatch(setIsPortrait(dim.height >= dim.width));
    Dimensions.addEventListener('change', () => {
      const dim = Dimensions.get('screen');
      const isPortrait = dim.height >= dim.width;
      dispatch(setIsPortrait(isPortrait));
    });
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <TranslationProvider>
            <NavigationContainer theme={theme}>
              <Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
                <Drawer.Screen
                  name={'Home'}
                  component={Home}
                  options={{...screenStyle, title: t('voley_scoreboard').toUpperCase()}}
                />
                <Drawer.Screen
                  name={'NewMatch'}
                  component={NewMatch}
                  options={{...screenStyle, title: t('new_match').toUpperCase()}}
                />
                <Drawer.Screen
                  name={'Match'}
                  component={Match}
                  options={{
                    ...screenStyle,
                    title: t('match').toUpperCase(),
                    unmountOnBlur: true,
                    screenOrientation: 'all',
                  }}
                />
              </Drawer.Navigator>
              <Spinner />
            </NavigationContainer>
          </TranslationProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppComponent />
        <Toast />
      </PersistGate>
    </Provider>
  );
};

export default App;
