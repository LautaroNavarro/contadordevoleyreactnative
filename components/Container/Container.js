import React from 'react';
import styled from 'styled-components';
import {KeyboardAvoidingView} from 'react-native';

const Container = props => {
  return (
    <KeyboardAvoidingView
      style={{flex: 1, display: 'flex'}}
      behavior={'height'}
      enabled={false}
    >
      {props.children}
    </KeyboardAvoidingView>
  );
};
export default Container;
