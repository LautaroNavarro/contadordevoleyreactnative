import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, IconButton, Colors, Modal, Portal } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import MatchSummaryModal from './../components/MatchSummaryModal';

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
  container: {
    flex: 0,
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
    }

  substractPointTeam(team) {
      this.match.substractPointTeam(team);
      this.setState(this.match.json());
  }

  addPointTeam(team) {
      this.match.addPointTeam(team);
      this.setState(this.match.json());
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

  componentDidMount () {
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

  getCurrentSet() {
      return this.state.sets[this.state.sets.length - 1];
  }

  dismissModal() {
      this.setState({dismissModal: true})
      this.props.navigation.navigate('Home');
  }

  render () {
    return (
      <View>
        <Portal>
        {this.state.winner != null ? <MatchSummaryModal visible={!this.state.dismissModal} match={this.state} onDismiss={() => {this.dismissModal()}} /> : null}
        </Portal>
        <View style={styles.container}>
          <View style={styles.item}>
            <Text style={styles.teamNames} >{this.state.teams.team_one.name}</Text>
            <View style={styles.container} >
              {this.getRenderedSets('team_one')}
            </View>
            <View style={{...styles.teamCountersContainer, backgroundColor: this.state.teams.team_one.color, borderColor: this.state.teams.team_one.color}}>
              <Text style={{fontSize: wp('20%'), color: 'white'}} >{this.getCurrentSet() !== undefined ? this.getCurrentSet().team_one : 0}</Text>
            </View>

            <View style={{...styles.container, marginLeft: 'auto', marginRight: 'auto'}}>
              <View>
                <IconButton
                  icon="minus"
                  color= {Colors.red500}
                  size={wp('10%')}
                  onPress={() => this.substractPointTeam(1)}
                />
              </View>
              <View>
                <IconButton
                    icon="plus"
                    color= {Colors.red500}
                    size={wp('10%')}
                    onPress={() => this.addPointTeam(1)}
                  />
                </View>
              </View>
          </View>
          <View style={styles.item}>
            <Text style={styles.teamNames}>{this.state.teams.team_two.name}</Text>
            <View style={styles.container} >
              {this.getRenderedSets('team_two')}
            </View>
            <View style={{...styles.teamCountersContainer, backgroundColor: this.state.teams.team_two.color, borderColor: this.state.teams.team_two.color}}>
              <Text style={{fontSize: wp('20%'), color: 'white'}} >{this.getCurrentSet() !== undefined ? this.getCurrentSet().team_two : 0}</Text>
            </View>
            <View style={{...styles.container, marginLeft: 'auto', marginRight: 'auto'}}>
              <View>
                <IconButton
                  icon="minus"
                  color= {Colors.red500}
                  size={wp('10%')}
                  onPress={() => this.substractPointTeam(2)}
                />
              </View>
              <View>
                <IconButton
                    icon="plus"
                    color= {Colors.red500}
                    size={wp('10%')}
                    onPress={() => this.addPointTeam(2)}
                  />
                </View>
              </View>
          </View>
        </View>
      </View>
    )
  }
}


export default Match;