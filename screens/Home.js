import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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

const Home = ({navigation}) => {

  const dispatch = useDispatch();
  const [matchCode, setMatchCode] = useState('');
  const [displayBanner, setDisplayBanner] = useState(false);

  const initAds = async () => {
    setDisplayBanner(true);
    console.log('Displaying banner');
  }

  useEffect(() => {
    initAds().catch((error) => console.log(error));
  }, []);

  const handleMatchCodeChange = (text) => {
    if (text.length <= 6) {
      setMatchCode(text);
    }
  }

  const handleJoinMatch = () => {
    navigation.navigate(
      'Match',
      {
        online: true,
        token: null,
        shareId: matchCode,
      }
    );
  }

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
          onPress={() => navigation.navigate('NewMatch')}
        >Nuevo partido</Button>
        <TextInput
          style={styles.item}
          label="Codigo de acceso"
          value={matchCode}
          onChangeText={text => handleMatchCodeChange(text)}
        />
        <Button
          style={styles.item}
          mode="contained"
          title="Unirse a partido"
          onPress={() => {handleJoinMatch()}}
        >Unirse a partido</Button>
      </View>
        {
          displayBanner && <View style={styles.adContainer}>
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


export default Home;