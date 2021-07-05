import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, TextInput } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { ColorPicker } from 'react-native-color-picker'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    width: wp('45%'),
    marginTop: hp('1%'),
    marginLeft: hp('1%'),
    marginRight: hp('1%'),
  }
});

class NewMatch extends Component {

  state = {
    team_one_color: 'red',
    team_two_color: 'purple',

    team_one_name: '',
    team_two_name: '',
  };

  handleChangeTeamOneColor(color) {
    this.setState({ team_one_color: color });
  };
  handleChangeTeamTwoColor(color) {
    this.setState({ team_two_color: color });
  };

  handleChangeTeamOneName(name) {
    this.setState({team_one_name: name})
  }

  handleChangeTeamTwoName(name) {
    this.setState({team_two_name: name})
  }

  render () {
    return (
        <View style={styles.container}>
          <View style={styles.item}>
          <TextInput
            style={styles.item}
            label="Equipo A"
            value={this.state.match_code}
            onChangeText={text => this.handleChangeTeamOneName(text)}
          />
          <Button
            style={styles.item}
            mode="contained"
            title="Color equipo A"
            color={this.state.team_one_color}
            onPress={() => this.props.navigation.navigate('ChangeTeamColor')}
          >Color equipo A</Button>
          </View>
          <View style={styles.item}>
          <TextInput
            style={styles.item}
            label="Equipo B"
            value={this.state.match_code}
            onChangeText={text => this.handleChangeTeamTwoName(text)}
          />
          <Button
            style={styles.item}
            mode="contained"
            title="Color equipo B"
            color={this.state.team_two_color}
            onPress={() => this.props.navigation.navigate('ChangeTeamColor')}
          >Color equipo B</Button>
          </View>
        </View>
    )
  }
}



export default NewMatch;