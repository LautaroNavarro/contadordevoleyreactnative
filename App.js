import {useSelector, Provider} from 'react-redux';
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {enableScreens} from 'react-native-screens';

import {selectTheme} from './reducers/theme/themeSlice';
import Home from './screens/Home';
import NewMatch from './screens/NewMatch/NewMatch';
import Match from './screens/Match/Match';
import {createStore} from './reducers/root';
import DrawerComponent from './components/Drawer/Drawer';

enableScreens(false);

axios.defaults.baseURL = 'https://contadordevoleybejs.herokuapp.com/';

const Drawer = createDrawerNavigator();
const store = createStore();
const persistor = persistStore(store);

const AppComponent = () => {
  const theme = useSelector(selectTheme);
  const screenStyle = {
    headerShown: true,
    headerTintColor: theme.colors.text,
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <NavigationContainer theme={theme}>
            <Drawer.Navigator drawerContent={props => <DrawerComponent {...props} />}>
              <Drawer.Screen name="Home" component={Home} options={{...screenStyle, title: 'Contador de voley'}} />
              <Drawer.Screen name="NewMatch" component={NewMatch} options={{...screenStyle, title: 'Nuevo partido'}} />
              <Drawer.Screen
                name="Match"
                component={Match}
                options={{...screenStyle, title: 'Partido', unmountOnBlur: true}}
              />
            </Drawer.Navigator>
          </NavigationContainer>
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
