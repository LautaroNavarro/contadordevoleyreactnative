import React from 'react';
import styled from 'styled-components';
import {Text, TextInput} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Feedback = styled(Text)`
  color: ${({theme}) => theme.colors.error};
`;

const StyledTextInput = styled(TextInput)`
  margin: ${hp(1)}px 0px;
  width: 100%;
`;

const LocalTextInput = ({maxLength, label, value, onChangeText, feedback, uppercase = false}) => {
  return (
    <>
      <StyledTextInput
        maxLength={maxLength}
        label={label}
        value={uppercase ? value.toUpperCase() : value}
        onChangeText={onChangeText}
      />
      {feedback && <Feedback>{feedback}</Feedback>}
    </>
  );
};

export default LocalTextInput;
