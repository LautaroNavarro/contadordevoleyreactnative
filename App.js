import { StatusBar } from 'expo-status-bar';
import {useSelector} from 'react-redux';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {ThemeProvider} from 'styled-components';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

import {selectTheme} from './reducers/theme/themeSlice';
import Home from './screens/Home';
import NewMatch from './screens/NewMatch';
import Match from './screens/Match';
import axios from 'axios';
import { enableScreens } from 'react-native-screens';
import { createStore } from './reducers/root';
import DrawerComponent from './components/Drawer/Drawer';

enableScreens(false);

axios.defaults.baseURL = 'https://contadordevoleybejs.herokuapp.com/';



const Drawer = createDrawerNavigator();
const store = createStore();

const AppComponent = ({children}) => {
  const theme = useSelector(selectTheme);
  const screenStyle = {
    headerShown: true,
    headerTintColor: theme.colors.text,
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <NavigationContainer theme={theme}>
            <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props}/>}>
              <Drawer.Screen name="Home" component={Home} options={{...screenStyle, title: 'Contador de voley'}}/>
              <Drawer.Screen name="NewMatch" component={NewMatch} options={{...screenStyle, title: 'Nuevo partido'}}/>
              <Drawer.Screen name="Match" component={Match} options={{...screenStyle, title: 'Partido'}}/>
            </Drawer.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );

}

const App = () => {
  return (
    <Provider store={store}>
        <AppComponent />
    </Provider>
  );
}

export default App;
