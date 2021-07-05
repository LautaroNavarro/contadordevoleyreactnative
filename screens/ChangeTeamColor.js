import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, TextInput } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { ColorPicker } from 'react-native-color-picker'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: wp('45%'),
    marginLeft: hp('1%'),
    marginRight: hp('1%'),
  }
});

class ChangeTeamColor extends Component {

  state = {
    team_one_color: 'red',
    team_two_color: 'purple',
  };

  handleChangeTeamOneColor(color) {
    this.setState({ team_one_color: color });
  };
  handleChangeTeamTwoColor(color) {
    this.setState({ team_two_color: color });
  };

  render () {
    return (
        <View style={{flex: 1, padding: 45}}>
            <ColorPicker 
              color={ this.state.team_one_color }
              onColorChange={ (color) => this.handleChangeTeamOneColor(color) }
              hideSliders={true}
              style={{flex: 1, paddingBottom: 200}}
            />
          <Button
            style={styles.item}
            mode="contained"
            style={{flex: 0}}
            title="Color equipo B"
            onPress={() => this.props.navigation.navigate('NewMatch')}
          >Cambiar color</Button>
        </View>
    )
  }
}


export default ChangeTeamColor;