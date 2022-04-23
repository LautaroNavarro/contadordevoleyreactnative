import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Image, View, Clipboard } from 'react-native';
import { Text, Button, IconButton, Colors, Modal, Portal, ActivityIndicator } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import socketIOClient from "socket.io-client";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  AdMobBanner,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

import MatchSummaryModal from './../components/MatchSummaryModal';
import MatchEngine from './../engine/MatchEngine';
import { setMatch, selectMatch, substractPointTeam, addPointTeam, cleanMatch } from './../reducers/match/matchSlice';
import { connectToSocket, emitMessage } from './../reducers/socket/socket.actions';
import AdBanner from './../components/Ads/AdBanner';
import Container from './../components/Container/Container';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
  },
  shareFont: {
    fontSize: 18
  },
  shareContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center'
  },
  shareSubContainer: {
    flexDirection: 'row',
  },
  item: {
    width: wp('45%'),
    marginTop: hp('1%'),
    marginLeft: hp('1%'),
    marginRight: hp('1%'),
  },
  teamNames: {
    fontSize: wp('5%'),
    marginBottom: hp('2%'),
  },
  teamCountersContainer: {
    borderWidth: 1,
    borderRadius: 15,
    width: '100%',
    height: hp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    marginLeft: wp('1%'),
    width: wp('7%'),
    height: wp('7%'),
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: hp('1%')
  },
});

const Match = ({route, navigation}) => {

  const dispatch = useDispatch();
  const match = useSelector(selectMatch);

  const [dismissModal, setDismissModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayCopiedMessage, setDisplayCopiedMessage] = useState(false);

  useEffect(async () => {

      if (route.params.online) {
        dispatch(setMatch({
          disabled_buttons: false,
          'id': null,
          'sets_number': route.params.sets,
          'status': null,
          'set_points_number': 25,
          'points_difference': 2,
          'tie_break_points': 15,
          'sets': [],
          'teams': {
              'team_one': {
                  'name': route.params.team_one_name,
                  'color': route.params.team_one_color,
              },
              'team_two': {
                  'name': route.params.team_two_name,
                  'color': route.params.team_two_color,
              }
          },
          'winner': null,
        }));
        await dispatch(connectToSocket());
        dispatch(emitMessage({
          destination: 'watch',
          body: {match_id: route.params.shareId},
        }));

        // this.setState({
        //   'loading': true,
        //   'teams': {
        //       'team_one': {
        //           'name': route.params.team_one_name,
        //           'color': route.params.team_one_color,
        //       },
        //       'team_two': {
        //           'name': route.params.team_two_name,
        //           'color': route.params.team_two_color,
        //       }
        //   },
        // });
        // let socket = socketIOClient('https://contadordevoleybejs.herokuapp.com/');
        // this.socket = socket;
        // this.subscribeMatch(socket);
      } else {
        dispatch(setMatch({
          // 'disabled_buttons': false,
          'id': null,
          'sets_number': route.params.sets,
          'status': null,
          'set_points_number': 25,
          'points_difference': 2,
          'tie_break_points': 15,
          'sets': [],
          'teams': {
              'team_one': {
                  'name': route.params.team_one_name,
                  'color': route.params.team_one_color,
              },
              'team_two': {
                  'name': route.params.team_two_name,
                  'color': route.params.team_two_color,
              }
          },
          'winner': null,
        }));
      }
  }, []);

  const substractPointTeamLocal = (team) => {
      if (route.params.online) {
        // this.callEvent(`substract_${team === 1 ? 'team_one' : 'team_two'}`)
      } else {
        dispatch(substractPointTeam(team));
      }
  }

  const addPointTeamLocal = (team) => {
    if (route.params.online) {
        dispatch(emitMessage({
          destination: 'update',
          body: {
            'id': route.params.shareId,
            'token': route.params.token,
            'action': `add_${team === 1 ? 'team_one' : 'team_two'}`,
          },
        }));
    } else {
      dispatch(addPointTeam(team));
    }
  }

  const getRenderedSets = (team) => {
      let renderedWon = match.teams[team].sets;
      let renderedWonCount = 0;

      let render = [];
      for (let i = 0; i < Math.floor(((match.sets_number / 2) + 1)); i++) {
          if (renderedWonCount < renderedWon) {
              render.push(
                  <View style={{...styles.circle, backgroundColor: 'white'}} key={`${team}-${i}`}></View>
              );
          } else {
              render.push(
                  <View style={{...styles.circle, borderColor: 'white'}} key={`${team}-${i}`}></View>
              );
          }
          renderedWonCount += 1;
      }
      return render;
  }

  // const subscribeMatch = async (socket) => {
  //     socket.emit('watch', {'match_id': route.params.shareId});
  //     socket.on(
  //         'match_update',
  //         (data) => {
  //             ((that) => {
  //                 console.log('Data recibida: ' + data.id);
  //                 that.setState({loading: false, disabled_buttons: false});
  //                 that.setState(data);
  //             })(this);
  //         }
  //     );
  // }

  // const callEvent = async (action) => {
  //     if (this.state.game_status !== 'FINISHED' && !this.state.disabled_buttons) {
  //         this.setState({disabled_buttons: true});
  //         this.socket.emit('update', {
  //             'id': route.params.shareId,
  //             'token': route.params.token,
  //             'action': action,
  //         });
  //     }
  // }

  const getCurrentSet = () => {
    return match.sets[match.sets.length - 1];
  }

  const dismissModalFunc = () => {
      dispatch(cleanMatch());
      setDismissModal(true);
      navigation.navigate('Home');
  }

  const copyToIdClipBoard = () => {
    Clipboard.setString(route.params.shareId);
    setDisplayCopiedMessage(true);
    setTimeout(
      () => {setDisplayCopiedMessage(false)},
      1000
    );
  }

  if (loading || !match) {
    return (
      <Modal visible={true} dismissable={false}>
        <ActivityIndicator animating={true} />
      </Modal>
    );
  }

  return (
    <Container>
      <Portal>
      {match.winner !== null ? <MatchSummaryModal visible={!dismissModal} match={match} onDismiss={() => {dismissModalFunc()}} /> : null}
      </Portal>
      {
        route.params.online && 
        <View style={styles.shareContainer}>
          <View style={styles.shareSubContainer}>
          <Icon.Button
            name="copy"
            backgroundColor='#d8358d'
            onPress={() => {copyToIdClipBoard()}}
          >
            {route.params.shareId}
          </Icon.Button>
          {
            match.displayCopiedMessage && <View style={{ backgroundColor: 'white', padding: 4, borderRadius: 15, margin: 1, position: 'absolute', left: 100}}>
            <Text style={{color: '#d8358d'}}>Copiado!</Text>
          </View>
          }

          </View>
        </View>
      }
      
      <View style={styles.container}>
        <View style={styles.item}>
          <Text style={styles.teamNames} >{match.teams.team_one.name}</Text>
          <View style={styles.container} >
            {getRenderedSets('team_one')}
          </View>
          <View style={{...styles.teamCountersContainer, backgroundColor: match.teams.team_one.color, borderColor: match.teams.team_one.color}}>
            <Text style={{fontSize: wp('20%'), color: 'white'}} >{getCurrentSet() !== undefined ? getCurrentSet().team_one : 0}</Text>
          </View>

          {
            ((route.params.online && route.params.token) || !route.params.online) &&
              <View style={{...styles.container, marginLeft: 'auto', marginRight: 'auto'}}>
                <View>
                  <IconButton
                    disabled={route.params.online ? match.disabled_buttons : false}
                    icon="minus"
                    color= {Colors.red500}
                    size={wp('10%')}
                    onPress={() => substractPointTeamLocal(1)}
                  />
                </View>
                <View>
                  <IconButton
                    disabled={route.params.online ? match.disabled_buttons : false}
                      icon="plus"
                      color= {Colors.red500}
                      size={wp('10%')}
                      onPress={() => addPointTeamLocal(1)}
                    />
                  </View>
                </View>
          }
        </View>
        <View style={styles.item}>
          <Text style={styles.teamNames}>{match.teams.team_two.name}</Text>
          <View style={styles.container} >
            {getRenderedSets('team_two')}
          </View>
          <View style={{...styles.teamCountersContainer, backgroundColor: match.teams.team_two.color, borderColor: match.teams.team_two.color}}>
            <Text style={{fontSize: wp('20%'), color: 'white'}} >{getCurrentSet() !== undefined ? getCurrentSet().team_two : 0}</Text>
          </View>
          {
            ((route.params.online && route.params.token) || !route.params.online) && 
              <View style={{...styles.container, marginLeft: 'auto', marginRight: 'auto'}}>
                <View>
                  <IconButton
                    disabled={route.params.online ? match.disabled_buttons : false}
                    icon="minus"
                    color= {Colors.red500}
                    size={wp('10%')}
                    onPress={() => substractPointTeamLocal(2)}
                  />
                </View>
                <View>
                  <IconButton
                      disabled={route.params.online ? match.disabled_buttons : false}
                      icon="plus"
                      color= {Colors.red500}
                      size={wp('10%')}
                      onPress={() => addPointTeamLocal(2)}
                    />
                  </View>
                </View>
          }
          </View>
      </View>
      <AdBanner />
    </Container>
  )
}


export default Match;