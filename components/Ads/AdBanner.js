import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Platform} from 'react-native';
import {AdMobBanner} from 'expo-ads-admob';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const BannerContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding: 1%;
  padding-bottom: ${hp(2)}px;
`;

const AdBanner = () => {
  const [displayBanner, setDisplayBanner] = useState(false);

  const initAds = async () => {
    setDisplayBanner(true);
  };

  useEffect(() => {
    initAds().catch(error => console.log(error)); // eslint-disable-line
  }, []);

  if (Platform.OS === 'ios') {
    return null;
  }

  return (
    <>
      {displayBanner && (
        <BannerContainer>
          <AdMobBanner
            bannerSize="banner"
            adUnitID="ca-app-pub-1559311694967743/5371344310"
            servePersonalizedAds
            onDidFailToReceiveAdWithError={err => {
              console.log(err); // eslint-disable-line
            }}
          />
        </BannerContainer>
      )}
    </>
  );
};

export default AdBanner;
