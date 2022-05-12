import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {SafeAreaView} from 'react-native-safe-area-context';

import {changeTheme, selectIsDarkTheme} from './../../reducers/theme/themeSlice';
import {changeEnabled, selectSoundEnabled} from './../../reducers/sound/soundSlice';
import WidthContainer from './../../components/Container/WidthContainer';
import Switch from './../../components/Inputs/Switch';

const Container = styled(SafeAreaView)`
  background-color: ${({theme}) => theme.colors.background};
  height: 100%;
`;

const DrawerOptionContainer = styled.TouchableOpacity`
  padding: 15px 0px;
  padding: 10px;
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

  const dispatch = useDispatch();

  return (
    <Container>
      <WidthContainer>
        <DrawerOptionContainer onPress={() => navigation.navigate('Home')}>
          <DrawerOptionText>Home</DrawerOptionText>
        </DrawerOptionContainer>
        <Line />
        <DrawerOptionContainer onPress={() => navigation.navigate('NewMatch')}>
          <DrawerOptionText>Nuevo partido</DrawerOptionText>
        </DrawerOptionContainer>
        <Switch
          value={isDarkTheme}
          onValueChange={() => {
            dispatch(changeTheme());
          }}
          label={'Dark mode'}
        />
        <Switch
          value={soundEnabled}
          onValueChange={() => {
            dispatch(changeEnabled());
          }}
          label={'Sound'}
        />
      </WidthContainer>
    </Container>
  );
};

export default Drawer;
