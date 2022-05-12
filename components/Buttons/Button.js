import React from 'react';
import styled from 'styled-components';
import {Button} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const StyledButton = styled(Button)`
  margin: ${hp(1)}px 0px;
  width: 100%;
  padding: ${hp(1)}px 0px;
`;

const LocalButton = ({disabled, mode = 'contained', onPress, text}) => {
  return (
    <>
      <StyledButton disabled={disabled} mode={mode} onPress={onPress}>
        {text}
      </StyledButton>
    </>
  );
};

export default LocalButton;
