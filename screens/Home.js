import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, Image, View, KeyboardAvoidingView } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import AdBanner from './../components/Ads/AdBanner';
import Container from './../components/Container/Container';

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
  },
  adContainer: {

  }
});

const Home = ({navigation}) => {

  const dispatch = useDispatch();
  const [matchCode, setMatchCode] = useState('');
  const [displayBanner, setDisplayBanner] = useState(false);

  const initAds = async () => {
    setDisplayBanner(true);
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
    <Container>
      <KeyboardAvoidingView
        behavior={'position'}
        enabled={true}
        keyboardVerticalOffset={50}
      >
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
          onChangeText={handleMatchCodeChange}
        />
        <Button
          style={styles.item}
          mode="contained"
          title="Unirse a partido"
          onPress={() => {handleJoinMatch()}}
        >Unirse a partido</Button>
      </View>
      <AdBanner />
      </KeyboardAvoidingView>
    </Container>
  )
}


export default Home;