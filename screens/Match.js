import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, IconButton, Colors, Modal, Portal, ActivityIndicator } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import MatchSummaryModal from './../components/MatchSummaryModal';
import socketIOClient from "socket.io-client";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  AdMobBanner,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';
import { Clipboard } from 'react-native';
import MatchEngine from './../engine/MatchEngine';

const styles = StyleSheet.create({
  bigContainer: {
    height: hp('100%'),
  },
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
  adContainer: {
    alignItems: 'center',
    width: wp('100%'),
    height: 50,
    bottom: 75,
    position: 'absolute',
  }
});

class Match extends Component {

  state = {
      'disabled_buttons': false,
      'loading': false,
      'id': null,
      'sets_number': 3,
      'status': null,
      'set_points_number': null,
      'points_difference': null,
      'tie_break_points': null,
      'sets': [],
      'teams': {
          'team_one': {
              'name': '',
              'color': '',
          },
          'team_two': {
              'name': '',
              'color': '',
          }
      },
      'winner': null,
      'dismissModal': false,
      'displayBanner': false,
      'token': null,
      'shareId': null,
      'game_status': null,
      'displayCopiedMessage': false,
    }

  initAds = async () => {
   this.setState({'displayBanner': true});
  }

  substractPointTeam(team) {
      if (this.props.route.params.online) {
        this.callEvent(`substract_${team === 1 ? 'team_one' : 'team_two'}`)
      } else {
        this.match.substractPointTeam(team);
        this.setState(this.match.json());
      }
  }

  addPointTeam(team) {
    if (this.props.route.params.online) {
      this.callEvent(`add_${team === 1 ? 'team_one' : 'team_two'}`)
    } else {
      this.match.addPointTeam(team);
      this.setState(this.match.json());
    }
  }

  getRenderedSets (team) {
      let renderedWon = this.state.teams[team].sets;
      let renderedWonCount = 0;

      let render = [];
      for (let i = 0; i < Math.floor(((this.state.sets_number / 2) + 1)); i++) {
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

  async subscribeMatch (socket) {
      socket.emit('watch', {'match_id': this.props.route.params.shareId});
      socket.on(
          'match_update',
          (data) => {
              ((that) => {
                  console.log('Data recibida: ' + data.id);
                  that.setState({loading: false, disabled_buttons: false});
                  that.setState(data);
              })(this);
          }
      );
  }

  async callEvent(action) {
      if (this.state.game_status !== 'FINISHED' && !this.state.disabled_buttons) {
          this.setState({disabled_buttons: true});
          this.socket.emit('update', {
              'id': this.props.route.params.shareId,
              'token': this.props.route.params.token,
              'action': action,
          });
      }
  }

  componentDidMount () {

      if (this.props.route.params.online) {
        this.setState({
          'loading': true,
          'teams': {
              'team_one': {
                  'name': this.props.route.params.team_one_name,
                  'color': this.props.route.params.team_one_color,
              },
              'team_two': {
                  'name': this.props.route.params.team_two_name,
                  'color': this.props.route.params.team_two_color,
              }
          },
        });
        let socket = socketIOClient('https://contadordevoleybejs.herokuapp.com/');
        this.socket = socket;
        this.subscribeMatch(socket);
      } else {
        let jsonMatch = {
          'disabled_buttons': false,
          'loading': false,
          'id': null,
          'sets_number': this.props.route.params.sets,
          'status': null,
          'set_points_number': 25,
          'points_difference': 2,
          'tie_break_points': 15,
          'sets': [],
          'teams': {
              'team_one': {
                  'name': this.props.route.params.team_one_name,
                  'color': this.props.route.params.team_one_color,
              },
              'team_two': {
                  'name': this.props.route.params.team_two_name,
                  'color': this.props.route.params.team_two_color,
              }
          },
          'winner': null,
          'dismissModal': false,
        }
        this.match = new MatchEngine(jsonMatch);
        this.setState(this.match.json())
      }

      this.initAds().catch((error) => console.log(error));
  }

  getCurrentSet() {
      return this.state.sets[this.state.sets.length - 1];
  }

  dismissModal() {
      this.setState({dismissModal: true})
      this.props.navigation.navigate('Home');
  }

  copyToIdClipBoard(){
    Clipboard.setString(this.props.route.params.shareId);
    this.setState({displayCopiedMessage: true});
    setTimeout(
      () => {this.setState({displayCopiedMessage: false})},
      1000
    );
  }

  render () {
    if (this.state.loading) {
      return (
        <Modal visible={true} dismissable={false}>
          <ActivityIndicator animating={true} />
        </Modal>
      );
    }
    return (
      <View style={styles.bigContainer}>
        <Portal>
        {this.state.winner != null ? <MatchSummaryModal visible={!this.state.dismissModal} match={this.state} onDismiss={() => {this.dismissModal()}} /> : null}
        </Portal>
        {
          this.props.route.params.online && 
          <View style={styles.shareContainer}>
            <View style={styles.shareSubContainer}>
            <Icon.Button
              name="copy"
              backgroundColor='#d8358d'
              onPress={() => {this.copyToIdClipBoard()}}
            >
              {this.props.route.params.shareId}
            </Icon.Button>
            {
              this.state.displayCopiedMessage && <View style={{ backgroundColor: 'white', padding: 4, borderRadius: 15, margin: 1, position: 'absolute', left: 100}}>
              <Text style={{color: '#d8358d'}}>Copiado!</Text>
            </View>
            }

            </View>
          </View>
        }
        
        <View style={styles.container}>
          <View style={styles.item}>
            <Text style={styles.teamNames} >{this.state.teams.team_one.name}</Text>
            <View style={styles.container} >
              {this.getRenderedSets('team_one')}
            </View>
            <View style={{...styles.teamCountersContainer, backgroundColor: this.state.teams.team_one.color, borderColor: this.state.teams.team_one.color}}>
              <Text style={{fontSize: wp('20%'), color: 'white'}} >{this.getCurrentSet() !== undefined ? this.getCurrentSet().team_one : 0}</Text>
            </View>

            {
              ((this.props.route.params.online && this.props.route.params.token) || !this.props.route.params.online) &&
                <View style={{...styles.container, marginLeft: 'auto', marginRight: 'auto'}}>
                  <View>
                    <IconButton
                      disabled={this.props.route.params.online ? this.state.disabled_buttons : false}
                      icon="minus"
                      color= {Colors.red500}
                      size={wp('10%')}
                      onPress={() => this.substractPointTeam(1)}
                    />
                  </View>
                  <View>
                    <IconButton
                      disabled={this.props.route.params.online ? this.state.disabled_buttons : false}
                        icon="plus"
                        color= {Colors.red500}
                        size={wp('10%')}
                        onPress={() => this.addPointTeam(1)}
                      />
                    </View>
                  </View>
            }
          </View>
          <View style={styles.item}>
            <Text style={styles.teamNames}>{this.state.teams.team_two.name}</Text>
            <View style={styles.container} >
              {this.getRenderedSets('team_two')}
            </View>
            <View style={{...styles.teamCountersContainer, backgroundColor: this.state.teams.team_two.color, borderColor: this.state.teams.team_two.color}}>
              <Text style={{fontSize: wp('20%'), color: 'white'}} >{this.getCurrentSet() !== undefined ? this.getCurrentSet().team_two : 0}</Text>
            </View>
            {
              ((this.props.route.params.online && this.props.route.params.token) || !this.props.route.params.online) && 
                <View style={{...styles.container, marginLeft: 'auto', marginRight: 'auto'}}>
                  <View>
                    <IconButton
                      disabled={this.props.route.params.online ? this.state.disabled_buttons : false}
                      icon="minus"
                      color= {Colors.red500}
                      size={wp('10%')}
                      onPress={() => this.substractPointTeam(2)}
                    />
                  </View>
                  <View>
                    <IconButton
                        disabled={this.props.route.params.online ? this.state.disabled_buttons : false}
                        icon="plus"
                        color= {Colors.red500}
                        size={wp('10%')}
                        onPress={() => this.addPointTeam(2)}
                      />
                    </View>
                  </View>
            }
            </View>
        </View>
          {
            this.state.displayBanner && <View style={styles.adContainer}>
            <AdMobBanner
              bannerSize="banner"
              adUnitID="ca-app-pub-1559311694967743/5371344310"
              servePersonalizedAds
              onDidFailToReceiveAdWithError={(err) => {
                console.log(err);
              }} />
            </View>
          }
      </View>
    )
  }
}


export default Match;