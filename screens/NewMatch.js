import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Text, Button, TextInput, RadioButton, Divider, ActivityIndicator, Modal, Portal } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import axios from 'axios';
import {
  AdMobBanner,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

import AdBanner from './../components/Ads/AdBanner';
import Container from './../components/Container/Container';
import Switch from './../components/Inputs/Switch';
import WidthContainer from './../components/Container/WidthContainer';

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
    loading: false,
  };

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
    <Container>
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
      <WidthContainer>
        <Switch label={'Partido online'} value={onlineMatch} onValueChange={value => handleChangeOnlineMatch(value)} />
      </WidthContainer>
      <View style={{marginLeft: wp('4%'), marginRight: wp('4%'), }}>
        <Button
          mode="contained"
          title="Nuevo partido"
          onPress={() => handleCreateMatch()}
        >Crear partido</Button>
      </View>
      <AdBanner />
    </Container>
  );
}



export default NewMatch;