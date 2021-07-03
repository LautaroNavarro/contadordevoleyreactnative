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

const Home = (navigator) => (
  <View>
    <Text>
      HOME SCREEN
    </Text>
    <Button
      title="Go to User"
      onPress={() => navigator.navigation.navigate('User')}
    >User</Button>
  </View>
)

const User = (navigator) => (
  <View>
    <Text>
      USER SCREEN
    </Text>
    <Button
      title="Go to home"
      onPress={() => navigator.navigation.navigate('Home')}
    >Home</Button>
  </View>
)

const MyComponent = () => (
 <Appbar.Header style={styles.bottom}>
   <Appbar.Action
     icon="archive"
     onPress={() => console.log('Pressed archive')}
    />
    <Appbar.Action icon="mail" onPress={() => console.log('Pressed mail')} />
    <Appbar.Action icon="label" onPress={() => console.log('Pressed label')} />
    <Appbar.Action
      icon="delete"
      onPress={() => console.log('Pressed delete')}
    />
  </Appbar.Header>
 );



const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const CardComponent = () => (
  <Card>
    <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
    <Card.Content>
      <Title>Card title</Title>
      <Paragraph>Card content</Paragraph>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card> 
);


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
    primary: 'purple',
    background: 'black',
    accent: 'yellow',
  },
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator>
         <Stack.Screen name="User" component={User} />
         <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
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
