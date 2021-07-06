import { StatusBar } from 'expo-status-bar';
import React from 'react';
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme} >
          <Stack.Navigator>
           <Stack.Screen name="Home" component={Home} options={{ title: 'Contador de voley' }}/>
           <Stack.Screen name="NewMatch" component={NewMatch} options={{ title: 'Nuevo partido' }}/>
           <Stack.Screen name="Match" component={Match} options={{ title: 'Partido' }}/>
          </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
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
