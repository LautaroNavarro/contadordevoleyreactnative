import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Container = styled.View`
  flex: 0;
  flex-direction: row;
`;

const Circle = styled.View`
  margin-left: ${wp('1%')}px;
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
  border-width: 1px;
  border-radius: 100px;
  margin-bottom: ${hp('1%')}px;
  background-color: ${({win, theme}) => (win ? theme.colors.text : 'transparent')};
  border-color: ${({win, theme}) => (!win ? theme.colors.text : 'transparent')};
`;

const Sets = ({sets_number, setsWon}) => {
  let renderedWonCount = 0;
  let render = [];

  for (let i = 0; i < Math.floor(sets_number / 2 + 1); i++) {
    render.push(<Circle key={i} win={renderedWonCount < setsWon} />);
    renderedWonCount += 1;
  }

  return <Container>{render}</Container>;
};

export default Sets;
