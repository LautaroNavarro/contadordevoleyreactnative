import React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {KeyboardAvoidingView} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';

import Button from './../components/Buttons/Button';
import AdBanner from './../components/Ads/AdBanner';
import Container from './../components/Container/Container';
import WidthContainer from './../components/Container/WidthContainer';
import TextInput from './../components/Inputs/TextInput';
import {selectIsPortrait} from './../reducers/responsive/responsiveSlice';

const Logo = styled.Image`
  width: ${wp(80)}px;
  height: ${wp(80)}px;
`;

const LogoContainer = styled.View`
  align-items: center;
  padding: ${hp(4)}px;
`;

const initialValues = {
  matchCode: '',
};

const validationSchema = yup.object().shape({
  matchCode: yup.string().min(6).max(6).required(),
});

const Home = ({navigation}) => {
  const {t} = useTranslation();
  const isPortrait = useSelector(selectIsPortrait);

  return (
    <Container>
      <KeyboardAvoidingView behavior={'position'} enabled={true} keyboardVerticalOffset={50}>
        {isPortrait && (
          <LogoContainer>
            <Logo source={require('./../assets/voley_logo.png')} />
          </LogoContainer>
        )}
        <WidthContainer>
          <Button mode="contained" text={t('new_match')} onPress={() => navigation.navigate('NewMatch')} />
          <Formik initialValues={initialValues} validateOnMount={true} validationSchema={validationSchema}>
            {({values, handleChange, errors, isValid, touched, setFieldValue}) => {
              const handleJoinMatch = values => {
                navigation.navigate('Match', {
                  online: true,
                  token: null,
                  shareId: values.matchCode.toLowerCase(),
                });
                setFieldValue('matchCode', '');
              };
              return (
                <>
                  <TextInput
                    maxLength={6}
                    label={t('access_code')}
                    value={values.matchCode}
                    onChangeText={handleChange('matchCode')}
                    feedback={touched.matchCode && errors.matchCode}
                    uppercase
                  />
                  <Button
                    disabled={!isValid || Object.keys(errors).length !== 0}
                    mode="contained"
                    text={t('join_match')}
                    onPress={() => handleJoinMatch(values)}
                  />
                </>
              );
            }}
          </Formik>
        </WidthContainer>
      </KeyboardAvoidingView>
      <AdBanner />
    </Container>
  );
};

export default Home;
