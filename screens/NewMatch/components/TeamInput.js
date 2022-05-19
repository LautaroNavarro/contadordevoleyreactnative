import React from 'react';
import styled from 'styled-components';
import {ColorPicker} from 'react-native-color-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import TextInput from './../../../components/Inputs/TextInput';

const Container = styled.View`
  width: 49%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

const ColorPickerContainer = styled.View`
  height: ${hp(20)}px;
`;

const Fixer = styled.View`
  margin-bottom: -200px;
`;

const TeamInput = ({nameValue, nameLabel, onNameChange, colorValue, onColorChange}) => {
  return (
    <>
      <Container>
        <TextInput label={nameLabel} value={nameValue} onChangeText={onNameChange} />
        <ColorPickerContainer>
          <ColorPicker color={colorValue} onColorChange={onColorChange} hideSliders={true} style={{flex: 1}} />
        </ColorPickerContainer>
      </Container>
      <Fixer />
    </>
  );
};

export default TeamInput;
