import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { Appbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import Home from './screens/Home';
import NewMatch from './screens/NewMatch';
import Match from './screens/Match';
import axios from 'axios';
import { enableScreens } from 'react-native-screens';

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

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#d8358d',
  },
};

const screenStyle = {
  animationEnabled: false,
}

console.log(theme)
const Stack = createStackNavigator();

class App extends Component {

  render () {
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme} >
            <Stack.Navigator>
             <Stack.Screen name="Home" component={Home} options={{...screenStyle, title: 'Contador de voley'}}/>
             <Stack.Screen name="NewMatch" component={NewMatch} options={{...screenStyle, title: 'Nuevo partido' }}/>
             <Stack.Screen name="Match" component={Match} options={{...screenStyle, title: 'Partido' }}/>
            </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }
}

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


export default App;