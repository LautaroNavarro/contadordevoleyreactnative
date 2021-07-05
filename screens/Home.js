import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, TextInput } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const styles = StyleSheet.create({
  logo: {
    width: wp('80%'),
    height: wp('80%'),
  },
  logoContainer: {
    alignItems: 'center',
    padding: hp('4%'),
  },
  container: {
    padding: hp('4%'),
  },
  item: {
    marginTop: hp('2%'),
  }
});

class Home extends Component {

  state = {
    'match_code': '',
  }

  handleMatchCodeChange (text) {
    if (text.length <= 6) {
      this.setState({match_code: text});
    }
  }

  render () {
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
            onPress={() => this.props.navigation.navigate('NewMatch')}
          >Nuevo partido</Button>
          <TextInput
            style={styles.item}
            label="Codigo de acceso"
            value={this.state.match_code}
            onChangeText={text => this.handleMatchCodeChange(text)}
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
}


export default Home;