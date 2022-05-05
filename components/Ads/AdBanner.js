import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {AdMobBanner} from 'expo-ads-admob';

const BannerContainer = styled.View`
  align-items: center;
  width: ${wp('100%')}px;
  margin-top: auto;
  padding: ${hp(1)}px;
  padding-bottom: ${hp(5)}px;
`;

const AdBanner = () => {

  const [displayBanner, setDisplayBanner] = useState(false);

  const initAds = async () => {
    setDisplayBanner(true);
  }

  useEffect(() => {
    initAds().catch((error) => console.log(error));
  }, []);

	return (
		<>
      {
        displayBanner && (
        	<BannerContainer>
		        <AdMobBanner
		          bannerSize="banner"
		          adUnitID="ca-app-pub-1559311694967743/5371344310"
		          servePersonalizedAds
		          onDidFailToReceiveAdWithError={(err) => {
		            console.log(err);
		          }} />
	        </BannerContainer>
       )
      }
		</>
	);
};

export default AdBanner;
