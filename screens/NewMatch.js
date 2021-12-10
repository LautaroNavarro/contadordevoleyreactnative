import React, { useEffect, useState } from 'react';

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

const NewMatch = ({navigation}) => {

  const [teamOneColor, setTeamOneColor] = useState({
    "h": 262.4053550874666,
    "s": 0.8208333333333333,
    "v": 0.9411764705882353,
  });

  const [teamOneName, setTeamOneName] = useState('');

  const [teamTwoColor, setTeamTwoColor] = useState({
    "h": 24.136044277629992,
    "s": 0.8208333333333333,
    "v": 0.9411764705882353,
  });

  const [teamTwoName, setTeamTwoName] = useState('');

  const [setPointsNumber, setSetPointsNumber] = useState(25);
  const [pointsDifference, setPointsDifference] = useState(2);
  const [tieBreakPoints, setTieBreakPoints] = useState(15);
  const [sets, setSets] = useState('3');
  const [onlineMatch, setOnlineMatch] = useState(false);
  const [displayBanner, setDisplayBanner] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const initAds = async () => {
   setDisplayBanner(true);
  }

  useEffect (() => {
    initAds().catch((error) => console.log(error));
  }, []);

  const handleChangeOnlineMatch = (value) => {
    setOnlineMatch(value)
  };

  const handleChangeTeamOneColor = (color) => {
    setTeamOneColor(color);
  };

  const handleChangeTeamTwoColor = (color) => {
    setTeamTwoColor(color);
  };

  const handleChangeTeamOneName = (name) => {
    setTeamOneName(name);
  }

  const handleChangeTeamTwoName = (name) => {
    setTeamTwoName(name);
  }

  const createOnlineMatch = async () => {
    setLoading(true);

    const body = {
        'sets_number': parseInt(sets),
        'set_points_number': setPointsNumber,
        'points_difference': pointsDifference,
        'tie_break_points': tieBreakPoints,
        'teams': {
            'team_one': {
                'name': teamOneName ? teamOneName : 'Equipo A',
                'color': fromHsv(teamOneColor),
            },
            'team_two': {
                'name': teamTwoName ? teamTwoName : 'Equipo B',
                'color': fromHsv(teamTwoColor),
            }
        }
    };

    let response;
    try {
        response = await axios.post('/matches/', body);
    } catch (error) {
        setLoading(false);
        console.log(error);
        console.log(body);
        return null
    }
    setLoading(false);
    navigation.navigate(
      'Match',
      {
        team_one_name: teamOneName,
        team_two_name: teamTwoName,
        team_one_color: fromHsv(teamOneColor),
        team_two_color: fromHsv(teamTwoColor),
        sets: sets,
        online: true,
        token: response.data.match.token,
        shareId: response.data.match.id,
      }
    );
  }

  const createLocalMatch = async () => {
    navigation.navigate(
      'Match',
      {
        team_one_name: teamOneName ? teamOneName : 'Equipo A',
        team_two_name: teamTwoName ? teamTwoName : 'Equipo B',
        team_one_color: fromHsv(teamOneColor),
        team_two_color: fromHsv(teamTwoColor),
        sets: sets,
        online: false,
      }
    );
  }

  const handleCreateMatch = async () => {
    if (onlineMatch) {
      createOnlineMatch();
    } else {
      createLocalMatch();
    }
  }

  return (
    <View style={styles.bigContainer}>
      {
        loading && <>
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
          value={teamOneName}
          onChangeText={text => handleChangeTeamOneName(text)}
        />
        <View style={{width: wp('40%'), height: wp('40%'), margin: wp('5%')}}>
          <View style={{flex: 1}}>
            <ColorPicker 
              color={ teamOneColor }
              onColorChange={ (color) => handleChangeTeamOneColor(color) }
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
            value={teamTwoName}
            onChangeText={text => handleChangeTeamTwoName(text)}
          />
        <View style={{width: wp('40%'), height: wp('40%'), margin: wp('5%')}}>
          <View style={{flex: 1}}>
            <ColorPicker 
              color={ teamTwoColor }
              onColorChange={ (color) => handleChangeTeamTwoColor(color) }
              hideSliders={true}
              style={{flex: 1}}
            />
          </View>
        </View>
        </View>
      </View>
      <Divider style={{marginLeft: wp('4%'), marginRight: wp('4%'), }} />
      <View style={{padding: wp('5')}} >
        <RadioButton.Group onValueChange={value => setSets(value)} value={sets}>
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
        <Switch style={{width: wp('10%')}} value={onlineMatch} onValueChange={value => handleChangeOnlineMatch(value)} />
      </View>
      <View style={{marginLeft: wp('4%'), marginRight: wp('4%'), }}>
        <Button
          mode="contained"
          title="Nuevo partido"
          onPress={() => handleCreateMatch()}
        >Crear partido</Button>
      </View>
        {
          displayBanner && <View style={styles.adContainer}>
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
  );
}



export default NewMatch;