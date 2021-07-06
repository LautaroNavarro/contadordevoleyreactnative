import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, TextInput, RadioButton, Divider } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { ColorPicker, fromHsv } from 'react-native-color-picker'

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
  }
});

class NewMatch extends Component {

  state = {
    team_one_color: 'red',
    team_two_color: 'blue',

    team_one_name: '',
    team_two_name: '',

    sets: '3',
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

  handleCreateMatch() {
    let team_one_name = this.state.team_one_name
    let team_two_name = this.state.team_two_name

    if (this.state.team_one_name == '') {
      team_one_name = 'Equipo A'
    }

    if (this.state.team_two_name == '') {
      team_two_name = 'Equipo B'
    }

    this.props.navigation.navigate(
      'Match',
      {
        team_one_name: team_one_name,
        team_two_name: team_two_name,
        team_one_color: fromHsv(this.state.team_one_color),
        team_two_color: fromHsv(this.state.team_two_color),
        sets: this.state.sets,
      }
    );
  }

  render () {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.item}>
          <TextInput
            style={styles.item}
            label="Equipo A"
            value={this.state.match_code}
            onChangeText={text => this.handleChangeTeamOneName(text)}
          />
          <View style={{width: wp('40%'), height: wp('40%'), margin: wp('5%')}}>
            <View style={{flex: 1}}>
              <ColorPicker 
                color={ this.state.team_one_color }
                onColorChange={ (color) => this.handleChangeTeamOneColor(color) }
                hideSliders={true}
                style={{flex: 1}}
              />
            </View>
          </View>
          </View>
          <View style={styles.item}>
            <TextInput
              style={styles.item}
              label="Equipo B"
              value={this.state.match_code}
              onChangeText={text => this.handleChangeTeamTwoName(text)}
            />
          <View style={{width: wp('40%'), height: wp('40%'), margin: wp('5%')}}>
            <View style={{flex: 1}}>
              <ColorPicker 
                color={ this.state.team_two_color }
                onColorChange={ (color) => this.handleChangeTeamTwoColor(color) }
                hideSliders={true}
                style={{flex: 1}}
              />
            </View>
          </View>
          </View>
        </View>
        <Divider style={{marginLeft: wp('4%'), marginRight: wp('4%'), }} />
        <View style={{padding: wp('5')}} >
          <RadioButton.Group onValueChange={value => this.setState({sets: value})} value={this.state.sets}>
            <RadioButton.Item label="Al mejor de 1 set" value="1" />
            <RadioButton.Item label="Al mejor de 2 sets" value="3" />
            <RadioButton.Item label="Al mejor de 3 sets" value="5" />
          </RadioButton.Group>
        </View>
        <View style={{marginLeft: wp('4%'), marginRight: wp('4%'), }}>
          <Button
            mode="contained"
            title="Nuevo partido"
            onPress={() => this.handleCreateMatch()}
          >Crear partido</Button>
        </View>
      </View>
    )
  }
}



export default NewMatch;