import React from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {Modal, Portal, ActivityIndicator} from 'react-native-paper';

import {selectLoadingDisplay, selectLoadingText} from './../../reducers/loading/loadingSlice';

const LoadingText = styled.Text`
  text-align: center;
  margin-top: 15px;
  font-size: 20px;
  color: white;
`;

const Spinner = () => {
  const displayLoading = useSelector(selectLoadingDisplay);
  const displayLoadingText = useSelector(selectLoadingText);

  if (!displayLoading) {
    return null;
  }

  return (
    <>
      <Portal>
        <Modal visible={true} dismissable={false}>
          <ActivityIndicator animating={true} size={50} />
          {displayLoadingText && <LoadingText>{displayLoadingText}</LoadingText>}
        </Modal>
      </Portal>
    </>
  );
};

export default Spinner;
