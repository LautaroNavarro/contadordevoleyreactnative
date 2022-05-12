import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Text, IconButton, Colors} from 'react-native-paper';
import {View} from 'react-native';

import Sets from './../../../components/Sets/Sets';

const Container = styled.View`
  flex-direction: row;
`;

const Item = styled.View`
  width: 49%;
  margin-top: ${hp(1)}px;
`;

const CounterContainer = styled.View`
  border-radius: 15px;
  width: 100%;
  height: ${hp(20)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({teamColor}) => teamColor};
  border: 1px solid ${({teamColor}) => teamColor};
`;

const TeamNames = styled.Text`
  font-size: ${wp(5)}px;
  margin-bottom: ${hp(2)}px;
  color: ${({theme}) => theme.colors.text};
`;

const TeamBoard = ({
  teamName,
  teamSets,
  matchSets,
  teamColor,
  teamCurrentSetPoints,
  isAdmin,
  disabledButtons,
  substractPointTeamLocal,
  addPointTeamLocal,
}) => {
  return (
    <Item>
      <TeamNames>{teamName}</TeamNames>
      <Container>
        <Sets sets_number={matchSets} setsWon={teamSets} />
      </Container>
      <CounterContainer teamColor={teamColor}>
        <Text style={{fontSize: wp('20%'), color: 'white'}}>{teamCurrentSetPoints}</Text>
      </CounterContainer>
      {isAdmin && (
        <Container style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <View>
            <IconButton
              disabled={disabledButtons}
              icon="minus"
              color={Colors.red500}
              size={wp('10%')}
              onPress={substractPointTeamLocal}
            />
          </View>
          <View>
            <IconButton
              disabled={disabledButtons}
              icon="plus"
              color={Colors.red500}
              size={wp('10%')}
              onPress={addPointTeamLocal}
            />
          </View>
        </Container>
      )}
    </Item>
  );
};

export default TeamBoard;
