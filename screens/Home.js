import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, TextInput } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  AdMobBanner,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

const styles = StyleSheet.create({
  bigContainer: {
    height: hp('100%'),
  },
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
  },
  adContainer: {
    alignItems: 'center',
    width: wp('100%'),
    height: 50,
    bottom: 75,
    position: 'absolute',
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

  handleJoinMatch () {
    this.props.navigation.navigate(
      'Match',
      {
        online: true,
        token: null,
        shareId: this.state.match_code,
      }
    );
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
      <View style={styles.bigContainer}>
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
            onPress={() => {this.handleJoinMatch()}}
          >Unirse a partido</Button>
        </View>
          {
            this.state.displayBanner && <View style={styles.adContainer}>
            <AdMobBanner
              bannerSize="banner"
              adUnitID="ca-app-pub-1559311694967743/5371344310"
              servePersonalizedAds
              onDidFailToReceiveAdWithError={(err) => {
                console.log('Banner error');
                console.log(err);
              }} />
            </View>
          }
      </View>
    )
  }
}


export default Home;