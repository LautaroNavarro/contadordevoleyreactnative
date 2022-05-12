import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {Clipboard} from 'react-native';
import {Text, Modal, Portal, ActivityIndicator} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Audio} from 'expo-av';

import MatchSummaryModal from './../../components/MatchSummaryModal';
import {
  setMatch,
  selectMatchError,
  selectMatch,
  substractPointTeam,
  addPointTeam,
  cleanMatch,
  setDisabledButtons,
  selectDisabledButtons,
  selectSoundToPlay,
  cleanSoundToPlay,
} from './../../reducers/match/matchSlice';
import {selectSoundEnabled} from './../../reducers/sound/soundSlice';
import {connectToSocket, emitMessage, disconnectSocket} from './../../reducers/socket/socket.actions';
import AdBanner from './../../components/Ads/AdBanner';
import Container from './../../components/Container/Container';
import WidthContainer from './../../components/Container/WidthContainer';
import Button from './../../components/Buttons/Button';
import TeamBoard from './components/TeamBoard';

const BoardsContainer = styled.View`
  display: flex;
  flex-direction: row;
  width: 95%;
  margin: 0px auto;
  justify-content: space-between;
`;

const ShareContainer = styled.View`
  margin: 20px 0px;
  align-items: center;
`;

const ShareSubContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

const CopiedMessageContainer = styled.View`
  top: 100%;
  position: absolute;
  align-items: baseline;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Triangle = styled.View`
  width: 0px;
  height: 0px;
  background-color: transparent;
  border-style: solid;
  border-top-width: 0px;
  border-right-width: 10px;
  border-bottom-width: 10px;
  border-left-width: 10px;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: ${({theme}) => theme.colors.onSurface};
  border-left-color: transparent;
`;

const CopiedMessage = styled.Text`
  background-color: ${({theme}) => theme.colors.onSurface};
  padding: 5px;
  border-radius: 15px;
  color: ${({theme}) => theme.colors.accent};
`;

const InvalidMatchIdContainer = styled(WidthContainer)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin: 0px auto;
`;

const InvalidMatchIdText = styled(Text)`
  font-size: ${wp(10)}px;
  text-align: center;
`;

const Match = ({route, navigation}) => {
  const dispatch = useDispatch();
  const match = useSelector(selectMatch);

  const [dismissModal, setDismissModal] = useState(false);
  const [displayCopiedMessage, setDisplayCopiedMessage] = useState(false);
  const [soundA, setSoundA] = useState(null);
  const [soundB, setSoundB] = useState(null);
  const soundEnabled = useSelector(selectSoundEnabled);
  const disabledButtons = useSelector(selectDisabledButtons);
  const soundToPlay = useSelector(selectSoundToPlay);
  const error = useSelector(selectMatchError);

  const playSoundA = async () => {
    if (soundEnabled) {
      const {sound} = await Audio.Sound.createAsync(require('./../../assets/sounds/point_a.mp3'));
      setSoundA(sound);
      await sound.playAsync();
    }
  };

  const playSoundB = async () => {
    if (soundEnabled) {
      const {sound} = await Audio.Sound.createAsync(require('./../../assets/sounds/point_b.mp3'));
      setSoundB(sound);
      await sound.playAsync();
    }
  };

  useEffect(() => {
    if (soundToPlay) {
      if (soundToPlay === 'add') {
        playSoundB();
      } else {
        playSoundA();
      }
      dispatch(cleanSoundToPlay());
    }
  }, [soundToPlay]);

  useEffect(() => {
    return () => {
      dispatch(cleanMatch());
      if (route.params.online) {
        dispatch(disconnectSocket());
      }
    };
  }, []);

  useEffect(() => {
    return soundA
      ? () => {
          soundA.unloadAsync();
        }
      : undefined;
  }, [soundA]);

  useEffect(() => {
    return soundB
      ? () => {
          soundB.unloadAsync();
        }
      : undefined;
  }, [soundB]);

  useEffect(() => {
    (async () => {
      if (route.params.online) {
        await dispatch(connectToSocket());
        dispatch(
          emitMessage({
            destination: 'watch',
            body: {match_id: route.params.shareId},
          }),
        );
      } else {
        dispatch(
          setMatch({
            id: null,
            sets_number: route.params.sets,
            status: null,
            set_points_number: 25,
            points_difference: 2,
            tie_break_points: 15,
            sets: [],
            teams: {
              team_one: {
                name: route.params.team_one_name,
                color: route.params.team_one_color,
              },
              team_two: {
                name: route.params.team_two_name,
                color: route.params.team_two_color,
              },
            },
            winner: null,
          }),
        );
      }
    })();
  }, []);

  const substractPointTeamLocal = async team => {
    if (route.params.online) {
      dispatch(setDisabledButtons(true));
      dispatch(
        emitMessage({
          destination: 'update',
          body: {
            id: route.params.shareId,
            token: route.params.token,
            action: `substract_${team === 1 ? 'team_one' : 'team_two'}`,
          },
        }),
      );
    } else {
      await playSoundA();
      dispatch(substractPointTeam(team));
    }
  };

  const addPointTeamLocal = async team => {
    if (route.params.online) {
      dispatch(setDisabledButtons(true));
      dispatch(
        emitMessage({
          destination: 'update',
          body: {
            id: route.params.shareId,
            token: route.params.token,
            action: `add_${team === 1 ? 'team_one' : 'team_two'}`,
          },
        }),
      );
    } else {
      await playSoundB();
      dispatch(addPointTeam(team));
    }
  };

  const getCurrentSet = () => {
    return match.sets[match.sets.length - 1];
  };

  const dismissModalFunc = () => {
    dispatch(cleanMatch());
    setDismissModal(true);
    navigation.navigate('Home');
  };

  const copyToIdClipBoard = () => {
    Clipboard.setString(route.params.shareId);
    setDisplayCopiedMessage(true);
    setTimeout(() => {
      setDisplayCopiedMessage(false);
    }, 1000);
  };

  if (error) {
    return (
      <InvalidMatchIdContainer>
        <InvalidMatchIdText>Codigo de partido invalido</InvalidMatchIdText>
        <Button mode="contained" text="Intentar de nuevo" onPress={() => navigation.navigate('Home')} />
      </InvalidMatchIdContainer>
    );
  }

  if (!match) {
    return (
      <Modal visible={true} dismissable={false}>
        <ActivityIndicator animating={true} />
      </Modal>
    );
  }

  return (
    <Container>
      <Portal>
        {match.winner !== null ? (
          <MatchSummaryModal
            visible={!dismissModal}
            match={match}
            onDismiss={() => {
              dismissModalFunc();
            }}
          />
        ) : null}
      </Portal>
      {route.params.online && (
        <ShareContainer>
          <ShareSubContainer>
            <Icon.Button
              name="copy"
              backgroundColor="#d8358d"
              onPress={() => {
                copyToIdClipBoard();
              }}
            >
              {route.params.shareId.toUpperCase()}
            </Icon.Button>
            {displayCopiedMessage && (
              <CopiedMessageContainer>
                <Triangle />
                <CopiedMessage>Copiado!</CopiedMessage>
              </CopiedMessageContainer>
            )}
          </ShareSubContainer>
        </ShareContainer>
      )}
      <BoardsContainer>
        <TeamBoard
          teamName={match.teams.team_one.name}
          teamSets={match.teams['team_one'].sets}
          matchSets={match.sets_number}
          teamColor={match.teams.team_one.color}
          teamCurrentSetPoints={getCurrentSet() !== undefined ? getCurrentSet().team_one : 0}
          isAdmin={(route.params.online && route.params.token) || !route.params.online}
          disabledButtons={route.params.online ? disabledButtons : false}
          substractPointTeamLocal={() => substractPointTeamLocal(1)}
          addPointTeamLocal={() => addPointTeamLocal(1)}
        />
        <TeamBoard
          teamName={match.teams.team_two.name}
          teamSets={match.teams['team_two'].sets}
          matchSets={match.sets_number}
          teamColor={match.teams.team_two.color}
          teamCurrentSetPoints={getCurrentSet() !== undefined ? getCurrentSet().team_two : 0}
          isAdmin={(route.params.online && route.params.token) || !route.params.online}
          disabledButtons={route.params.online ? disabledButtons : false}
          substractPointTeamLocal={() => substractPointTeamLocal(2)}
          addPointTeamLocal={() => addPointTeamLocal(2)}
        />
      </BoardsContainer>
      <AdBanner />
    </Container>
  );
};

export default Match;
