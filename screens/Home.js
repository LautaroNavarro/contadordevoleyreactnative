import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, TextInput } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  AdMobBanner,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

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
    'displayBanner': false,
  }

  handleMatchCodeChange (text) {
    if (text.length <= 6) {
      this.setState({match_code: text});
    }
  }

  componentDidMount(){
    this.initAds().catch((error) => console.log(error));
  }

  initAds = async () => {
   this.setState({'displayBanner': true});
   console.log('Displaying banner');
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
          {
            this.state.displayBanner && <>
            <AdMobBanner
              bannerSize="fullBanner"
              adUnitID="ca-app-pub-1559311694967743/5371344310"
              servePersonalizedAds
              onDidFailToReceiveAdWithError={(err) => {
                console.log('Banner error');
                console.log(err);
              }} />
            </>
          }
        </View>
      </View>
    )
  }
}


export default Home;