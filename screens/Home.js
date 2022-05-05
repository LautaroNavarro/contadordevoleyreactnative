import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, Image, View, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as yup from 'yup';
import {Formik} from 'formik';

import Button from './../components/Buttons/Button';
import AdBanner from './../components/Ads/AdBanner';
import Container from './../components/Container/Container';
import WidthContainer from './../components/Container/WidthContainer';
import TextInput from './../components/Inputs/TextInput';

const styles = StyleSheet.create({
  logo: {
    width: wp('80%'),
    height: wp('80%'),
  },
  logoContainer: {
    alignItems: 'center',
    padding: hp('4%'),
  },
});

const initialValues = {
  matchCode: '',
}

const validationSchema = yup.object().shape({
  matchCode: yup.string().min(6).max(6).required(),
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

  const handleJoinMatch = (values) => {
    navigation.navigate(
      'Match',
      {
        online: true,
        token: null,
        shareId: values.matchCode.toLowerCase(),
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
      <WidthContainer>
        <Button
          mode="contained"
          text='Nuevo partido'
          onPress={() => navigation.navigate('NewMatch')}
        />
        <Formik
          initialValues={initialValues}
          validateOnMount={true}
          validationSchema={validationSchema}
          onSubmit={handleJoinMatch}
        >
        {({values, handleChange, errors, isValid, handleSubmit, touched}) => {
          return (
            <>
              <TextInput
                maxLength={6}
                label="Codigo de acceso"
                value={values.matchCode}
                onChangeText={handleChange('matchCode')}
                feedback={touched.matchCode && errors.matchCode}
              />
              <Button
                disabled={!isValid || Object.keys(errors).length !== 0}
                mode="contained"
                text="Unirse a partido"
                onPress={handleSubmit}
              />
            </>
          );
        }}
        </Formik>
      </WidthContainer>
      </KeyboardAvoidingView>
      <AdBanner />
    </Container>
  )
}


export default Home;