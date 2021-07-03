import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

const NewMatch = (navigator) => (
    <View>
      <Text>
        NEWMATCH SCREEN
      </Text>
      <Button
        mode="contained"
        title="Go to home"
        onPress={() => navigator.navigation.navigate('Home')}
      >Home</Button>
    </View>
)

export default NewMatch;