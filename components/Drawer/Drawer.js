import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';

import {changeTheme, selectIsDarkTheme} from './../../reducers/theme/themeSlice';
import {changeEnabled, selectSoundEnabled} from './../../reducers/sound/soundSlice';
import {selectSelectedLanguage, changeSelectedLanguage} from './../../reducers/language/languageSlice';
import WidthContainer from './../../components/Container/WidthContainer';
import Switch from './../../components/Inputs/Switch';
import Dropdown from './../../components/Inputs/Dropdown';

const Header = styled.Image`
  background-color: ${({theme}) => theme.colors.accent};
  width: 100%;
  height: ${({height}) => height}px;
`;

const Container = styled.View`
  background-color: ${({theme}) => theme.colors.background};
  padding-top: ${hp(2)}px;
  height: ${({height}) => height}px;
  padding-bottom: ${({paddingBottom}) => paddingBottom}px;
`;

const LanguageSelectorContainer = styled.View`
  margin-top: auto;
`;

const DrawerOptionContainer = styled.TouchableOpacity`
  padding: 15px 10px;
`;

const Line = styled.View`
  background-color: ${({theme}) => theme.colors.text};
  height: 1px;
`;

const DrawerOptionText = styled.Text`
  color: ${({theme}) => theme.colors.text};
`;

const Drawer = ({navigation}) => {
  const isDarkTheme = useSelector(selectIsDarkTheme);
  const soundEnabled = useSelector(selectSoundEnabled);
  const selectedLanguage = useSelector(selectSelectedLanguage);

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  return (
    <>
      <Header
        blurRadius={5}
        source={{
          uri: 'https://media.lacapital.com.ar/p/4d90b533a4cebcfd3d7eec74b8ed804f/adjuntos/204/imagenes/030/612/0030612512/voleysub21jpg.jpg',
        }}
        height={insets.top + hp(15)}
      />
      <Container height={hp(100) - (insets.top + hp(15))} paddingBottom={insets.bottom}>
        <WidthContainer>
          <DrawerOptionContainer onPress={() => navigation.navigate('Home')}>
            <DrawerOptionText>{t('home')}</DrawerOptionText>
          </DrawerOptionContainer>
          <Line />
          <DrawerOptionContainer onPress={() => navigation.navigate('NewMatch')}>
            <DrawerOptionText>{t('new_match')}</DrawerOptionText>
          </DrawerOptionContainer>
          <Switch
            value={isDarkTheme}
            onValueChange={() => {
              dispatch(changeTheme());
            }}
            label={t('dark_mode')}
          />
          <Switch
            value={soundEnabled}
            onValueChange={() => {
              dispatch(changeEnabled());
            }}
            label={t('sounds')}
          />
        </WidthContainer>
        <LanguageSelectorContainer>
          <WidthContainer>
            <Dropdown
              label={t('language')}
              value={selectedLanguage}
              items={[
                {label: 'Español', value: 'es'},
                {label: 'English', value: 'en'},
              ]}
              onValueChange={value => {
                dispatch(changeSelectedLanguage(value()));
              }}
            />
          </WidthContainer>
        </LanguageSelectorContainer>
      </Container>
    </>
  );
};

export default Drawer;
