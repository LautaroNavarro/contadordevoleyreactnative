import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {Switch as SwitchPaper} from 'react-native-paper';

import {selectTheme} from './../../reducers/theme/themeSlice';

const Container = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0px;
`;

const LabelText = styled.Text`
  color: ${({theme}) => theme.colors.text};
`;

const Switch = ({value, onValueChange, label}) => {
  const theme = useSelector(selectTheme);

  return (
    <Container>
      <LabelText>{label}</LabelText>
      <SwitchPaper value={value} onValueChange={onValueChange} theme={theme} />
    </Container>
  );
};

export default Switch;
