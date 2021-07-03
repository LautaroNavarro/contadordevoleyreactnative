import * as React from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, TextInput } from 'react-native-paper';


const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 250,
  },
  logoContainer: {
    alignItems: 'center',
    padding: 20,
  },
  container: {
    padding: 30,
  },
  item: {
    marginTop: 10,
  }
});

const Home = (navigator) => {

  const [text, setText] = React.useState('');

  return (
    <View>
      <View style={styles.logoContainer} >
        <Image source={require('./../assets/voley_logo.png')} style={styles.logo} />
      </View>
      <View style={styles.container} >
        <Button
          style={styles.item}
          mode="contained"
          title="Nuevo partido"
          onPress={() => navigator.navigation.navigate('NewMatch')}
        >Nuevo partido</Button>
        <TextInput
          style={styles.item}
          label="Codigo de acceso"
          value={text}
          onChangeText={text => setText(text)}
        />
        <Button
          style={styles.item}
          mode="contained"
          title="Unirse a partido"
          onPress={() => {}}
        >Unirse a partido</Button>
      </View>
    </View>
  )
}

export default Home;