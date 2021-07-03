import React from 'react';

import { Text, View } from 'react-native';

import { Button } from 'react-native-paper';

const Home = (navigator) => (
  <View>
    <Text>
      HOME SCREEN
    </Text>
    <Button
      mode="contained"
      title="Go to new match"
      onPress={() => navigator.navigation.navigate('NewMatch')}
    >New Match</Button>
  </View>
)

export default Home;