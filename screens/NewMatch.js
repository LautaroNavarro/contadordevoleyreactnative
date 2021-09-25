import React, { Component } from 'react';

import { StyleSheet, Image, View } from 'react-native';

import { Text, Button, TextInput, RadioButton, Divider, Switch, ActivityIndicator, Modal, Portal } from 'react-native-paper';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { ColorPicker, fromHsv } from 'react-native-color-picker'

import axios from 'axios';

import {
  AdMobBanner,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

const styles = StyleSheet.create({
  bigContainer: {
    height: hp('100%'),
  },
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
  adContainer: {
    alignItems: 'center',
    width: wp('100%'),
    height: 50,
    bottom: 75,
    position: 'absolute',
  }
});

class NewMatch extends Component {

  state = {
    team_one_color: {
        "h": 262.4053550874666,
        "s": 0.8208333333333333,
        "v": 0.9411764705882353,
    },
    team_two_color: {
        "h": 24.136044277629992,
        "s": 0.8208333333333333,
        "v": 0.9411764705882353,
    },
    team_one_name: '',
    team_two_name: '',
    set_points_number: 25,
    points_difference: 2,
    tie_break_points: 15,
    sets: '3',
    online_match: false,
    displayBanner: false,
    loading: false,
  };

  componentDidMount(){
    this.initAds().catch((error) => console.log(error));
  }

  initAds = async () => {
   this.setState({'displayBanner': true});
  }

  handleChangeOnlineMatch(value) {
    this.setState({ online_match: value });
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

  async handleCreateMatch() {
    if (this.state.online_match) {

      this.setState({'loading': true});

      let stateCopy = {...this.state};
      stateCopy.sets_number = parseInt(stateCopy.sets);
      stateCopy.teams = {
        'team_one': {
            'name': this.state.team_one_name ? this.state.team_one_name : 'Equipo A',
            'color': fromHsv(this.state.team_one_color),
        },
        'team_two': {
            'name': this.state.team_two_name ? this.state.team_two_name : 'Equipo B',
            'color': fromHsv(this.state.team_two_color),
        }
      };

      delete stateCopy.sets;
      delete stateCopy.loading;
      delete stateCopy.online_match;
      delete stateCopy.displayBanner;
      delete stateCopy.team_one_name;
      delete stateCopy.team_one_color;
      delete stateCopy.team_two_name;
      delete stateCopy.team_two_color;

      let response;
      try {
          response = await axios.post('/matches/', stateCopy);
      } catch (error) {
          this.setState({'loading': false});
          console.log(stateCopy);
          return null
      }
      this.setState({'loading': false});
      this.props.navigation.navigate(
        'Match',
        {
          team_one_name: this.state.team_one_name,
          team_two_name: this.state.team_two_name,
          team_one_color: fromHsv(this.state.team_one_color),
          team_two_color: fromHsv(this.state.team_two_color),
          sets: this.state.sets,
          online: true,
          token: response.data.match.token,
          shareId: response.data.match.id,
        }
      );


    } else {
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
          online: false,
        }
      );
    }
  }

  render () {
    return (
      <View style={styles.bigContainer}>
        {
          this.state.loading && <>
            <Portal>
              <Modal visible={true} dismissable={false}>
                <ActivityIndicator animating={true} />
              </Modal>
            </Portal>
          </>
        }
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
        <Divider style={{marginLeft: wp('4%'), marginRight: wp('4%'), }} />
        <View style={{padding: wp('5'), flexDirection: 'row', flex:0, marginRight: wp('4%')}}>
          <View style={{width: wp('80%'), padding: 5}}>
            <Text style={{ fontSize: 18}}>Partido online</Text>
          </View>
          <Switch style={{width: wp('10%')}}value={this.state.online_match} onValueChange={value => this.handleChangeOnlineMatch(value)} />
        </View>
        <View style={{marginLeft: wp('4%'), marginRight: wp('4%'), }}>
          <Button
            mode="contained"
            title="Nuevo partido"
            onPress={() => this.handleCreateMatch()}
          >Crear partido</Button>
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



export default NewMatch;