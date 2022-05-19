import React from 'react';
import styled from 'styled-components';
import {View} from 'react-native';
import {Text, Divider, DataTable} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';

import Button from './../components/Buttons/Button';

const Container = styled.View`
  height: 70%;
  width: 90%;
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 5%;
  background-color: ${({theme}) => theme.colors.secondaryBackground};
  border-radius: 5px;
`;

const ButtonContainer = styled.View`
  margin-top: auto;
`;

const ModalContainer = styled.View`
  width: 100%;
  height: 100%;
  margin: auto;
  background-color: #00000050;
`;

const MatchSummaryModal = props => {
  const {t} = useTranslation();

  const getLosserTeam = () => {
    if (props.match.winner === 'team_one') {
      return props.match.teams.team_two;
    } else {
      return props.match.teams.team_one;
    }
  };

  const getSetsRendered = () => {
    let setsRendered = [];
    for (var i = 0; i < props.match.sets.length; i++) {
      setsRendered.push(
        <DataTable.Row key={`set-${i}`}>
          <DataTable.Cell>{i + 1}</DataTable.Cell>
          <DataTable.Cell>{props.match.sets[i].team_one}</DataTable.Cell>
          <DataTable.Cell>{props.match.sets[i].team_two}</DataTable.Cell>
        </DataTable.Row>,
      );
    }
    return setsRendered;
  };

  const losserTeam = getLosserTeam();

  return (
    <ModalContainer>
      <Container>
        <Text style={{fontSize: 20}}>
          {t('team_a_beat_team_b', {
            team_a: props.match.teams[props.match.winner].name,
            team_b: losserTeam.name,
          })}
        </Text>
        <Text>
          {t('team_a_points_to_team_b_points', {
            team_a_points: props.match.teams[props.match.winner].sets,
            team_b_points: losserTeam.sets,
          })}
        </Text>
        <Divider style={{marginTop: 10, marginBottom: 10, paddingTop: 3}} />
        <Text>{t('set_details')}</Text>
        <View style={{width: wp('80%')}}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>#</DataTable.Title>
              <DataTable.Title>{props.match.teams[props.match.winner].name}</DataTable.Title>
              <DataTable.Title>{losserTeam.name}</DataTable.Title>
            </DataTable.Header>
          </DataTable>
          {getSetsRendered()}
        </View>
        <ButtonContainer>
          <Button mode="contained" text={t('continue')} onPress={props.onDismiss} />
        </ButtonContainer>
      </Container>
    </ModalContainer>
  );
};

export default MatchSummaryModal;
