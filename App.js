import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, TouchableRipple, Switch, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ThemeProvider } from "styled-components";
import { Appbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

import { selectSelectedTheme } from './reducers/settings/settingsSlice';
import DrawerContent from './components/DrawerContent';
import Home from './screens/Home';
import NewMatch from './screens/NewMatch';
import Match from './screens/Match';
import axios from 'axios';
import { enableScreens } from 'react-native-screens';
import { createStore } from './reducers/root';
import SoundEngine from './common/sounds';

enableScreens(false);

axios.defaults.baseURL = 'https://contadordevoleybejs.herokuapp.com/';

const AnotherScreen = () => (
  <SafeAreaProvider>
    <SafeAreaInsetsContext.Consumer>
      {(insets) => <MyComponent style={{ paddingTop: insets.top }} />}
    </SafeAreaInsetsContext.Consumer>

    <CardComponent> </CardComponent>
    <View style={styles.container}>
      <Text style={styles.text} >Hello world</Text>
      <StatusBar style="auto" />
    </View>

  </SafeAreaProvider>
)

export const SoundEngineInstance = new SoundEngine();

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

const store = createStore();

const App = (props) => {

  const theme = useSelector(selectSelectedTheme);

  const screenStyle = {
    headerTintColor: theme.colors.text,
  }

  return (
    <ThemeProvider theme={theme}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme} >
          <Drawer.Navigator drawerContent={() => <DrawerContent theme={theme}/>} initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} options={{...screenStyle, title: 'Contador de voley'}}/>
            <Drawer.Screen name="NewMatch" component={NewMatch} options={{...screenStyle, title: 'Nuevo partido' }}/>
            <Drawer.Screen name="Match" component={Match} options={{...screenStyle, title: 'Partido' }}/>
          </Drawer.Navigator>
{/*              <Stack.Navigator>
             <Stack.Screen name="Home" component={Home} options={{...screenStyle, title: 'Contador de voley'}}/>
             <Stack.Screen name="NewMatch" component={NewMatch} options={{...screenStyle, title: 'Nuevo partido' }}/>
             <Stack.Screen name="Match" component={Match} options={{...screenStyle, title: 'Partido' }}/>
            </Stack.Navigator>*/}
        </NavigationContainer>
      </PaperProvider>
    </ThemeProvider>
  );
}

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
  },
  bottom: {
    left: 0,
    right: 0,
  },
});


export default AppWrapper;