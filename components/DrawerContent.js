import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple, Switch } from 'react-native-paper';
import styled from "styled-components";

import { selectDarkMode, selectSound, setSound, setDarkMode } from './../reducers/settings/settingsSlice';

const DrawerContentContainer = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  height: 100%;
  padding-top: 20px;
  color: ${props => props.theme.colors.text};
`;

const DrawerSection = styled(View)`
  margin-top: 15px;
`;

const DrawerPreference = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 12px;
  padding-horizontal: 16;
`;

function DrawerContent(props) {

  const dispatch = useDispatch();
  const sound = useSelector(selectSound);
  const darkMode = useSelector(selectDarkMode);

  return (
    <DrawerContentContainer>
      <DrawerSection>
        <TouchableRipple onPress={() => {
          dispatch(setDarkMode(!darkMode));
        }}>
          <DrawerPreference>
            <Text style={{color: props.theme.colors.text}}>DARK THEME</Text>
            <Switch value={darkMode} color={props.theme.colors.primary} onValueChange={() => {
            dispatch(setDarkMode(!darkMode));
          }}/>
          </DrawerPreference>
        </TouchableRipple>
        <TouchableRipple onPress={() => {
          dispatch(setSound(!sound));
        }}>
          <DrawerPreference>
            <Text style={{color: props.theme.colors.text}}>SOUNDS</Text>
            <Switch value={sound} color={props.theme.colors.primary} onValueChange={() => {
            dispatch(setSound(!sound));
          }}/>
          </DrawerPreference>
        </TouchableRipple>
      </DrawerSection>
    </DrawerContentContainer>
    );
}

export default DrawerContent;