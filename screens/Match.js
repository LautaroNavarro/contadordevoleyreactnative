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

class MatchEngine {

    static PLAYING_STATUS = 'PLAYING';
    static FINISHED_STATUS = 'FINISHED';
    static DEFAULT_SETS_NUMBER = 5;
    static DEFAULT_SET_POINTS_NUMBER = 25;
    static DEFAULT_POINTS_DIFFERENCE = 2;
    static DEFAULT_TIE_BREAK_POINTS = 15;
    static TEAM_ONE = 'team_one';
    static TEAM_TWO = 'team_two';

    constructor (matchJson) {
        this.teams = matchJson.teams;
        this.teams.team_one.sets = matchJson.teams.team_one.sets ? matchJson.teams.team_one.sets : 0;
        this.teams.team_two.sets = matchJson.teams.team_two.sets ? matchJson.teams.team_two.sets : 0;
        this.sets_number = matchJson.sets_number ? matchJson.sets_number : this.constructor.DEFAULT_SETS_NUMBER;
        this.set_points_number = matchJson.set_points_number ? matchJson.set_points_number : this.constructor.DEFAULT_SET_POINTS_NUMBER;
        this.points_difference = matchJson.points_difference ? matchJson.points_difference : this.constructor.DEFAULT_POINTS_DIFFERENCE;
        this.tie_break_points = matchJson.tie_break_points ? matchJson.tie_break_points : this.constructor.DEFAULT_TIE_BREAK_POINTS;
        this.status = matchJson.status ? matchJson.status : this.constructor.PLAYING_STATUS;
        this.sets = [this.constructor.generateSet()];
        this.winner = matchJson.winner ? matchJson.winner : null;
    }

    static generateSet () {
        return {
            'team_one': 0,
            'team_two': 0,
            'winner': null,
        }
    }

    json () {
        return {
            'teams': this.teams,
            'sets_number': this.sets_number,
            'set_points_number': this.set_points_number,
            'points_difference': this.points_difference,
            'tie_break_points': this.tie_break_points,
            'status': this.status,
            'sets': this.sets,
            'winner': this.winner
        }
    }

    addPointTeam (team) {
        if (this.status === this.constructor.FINISHED_STATUS) {
            return false;
        }
        let team_points = team === 1 ? 'team_one' : 'team_two';
        let other_team_points = team !== 1 ? 'team_one' : 'team_two';
        let index = this.sets.length - 1;
        this.sets[index][team_points] = this.sets[index][team_points] + 1;
        if (
            this.sets[index][team_points] >= (this.sets[index][other_team_points] + this.points_difference ) &&
            this.sets[index][team_points] >= this.set_points_number || 
            this.sets.length === (this.sets_number) && this.sets[index][team_points] >= (this.sets[index][other_team_points] + this.points_difference ) &&
            this.sets[index][team_points] >= this.tie_break_points
        ) {
            // The set finished?

            this.teams[team_points].sets = this.teams[team_points].sets + 1; // Register that the team win a set
            this.sets[index].winner = team_points; // Register that this set was winned by the team

            if (
                this.teams[team_points].sets >= Math.ceil(this.sets_number / 2)
            ){
                // The match finished?
                this.status = this.constructor.FINISHED_STATUS;
                this.winner = team_points;
            } else {
                // Create new set
                this.sets.push(this.constructor.generateSet());
            }
        }
    }

    substractPointTeam (team) {
        if (this.status === this.constructor.FINISHED_STATUS) {
            return false;
        }
        let index = this.sets.length - 1;
        let team_points = team === 1 ? 'team_one' : 'team_two';
        if (this.sets[index][team_points] === 0){
            if (this.sets.length === 1){
                return false;
            }
            this.sets.pop();
            let index = this.sets.length - 1;
            this.teams[this.sets[index].winner].sets = this.teams[this.sets[index].winner].sets - 1;
            this.sets[index][this.sets[index].winner] = this.sets[index][this.sets[index].winner] - 1;
            this.sets[index].winner = null;
        } else {
            this.sets[index][team_points] = this.sets[index][team_points] - 1;
        }
    }

}

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