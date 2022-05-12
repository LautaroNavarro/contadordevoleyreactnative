import React, {useState} from 'react';
import styled from 'styled-components';
import {RadioButton, ActivityIndicator, Modal, Portal} from 'react-native-paper';
import {fromHsv} from 'react-native-color-picker';
import axios from 'axios';
import * as yup from 'yup';
import {Formik} from 'formik';

import AdBanner from './../../components/Ads/AdBanner';
import Container from './../../components/Container/Container';
import Switch from './../../components/Inputs/Switch';
import WidthContainer from './../../components/Container/WidthContainer';
import Button from './../../components/Buttons/Button';
import Divider from './../../components/Divider/Divider';
import TeamInput from './components/TeamInput';

const TeamInputsContainer = styled(WidthContainer)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const initialValues = {
  team_one_color: {
    h: 262.4053550874666,
    s: 0.8208333333333333,
    v: 0.9411764705882353,
  },
  team_two_color: {
    h: 24.136044277629992,
    s: 0.8208333333333333,
    v: 0.9411764705882353,
  },
  team_one_name: '',
  team_two_name: '',
  set_points_number: 25,
  points_difference: 2,
  tie_break_points: 15,
  sets: '3',
  online_match: false,
};

const validationSchema = yup.object().shape({
  team_one_name: yup.string(),
  team_two_name: yup.string(),
  set_points_number: yup.number().required(),
  points_difference: yup.number().required(),
  tie_break_points: yup.number().required(),
  online_match: yup.bool().required(),
  sets: yup.string().required(),
});

const NewMatch = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const createOnlineMatch = async ({
    set_points_number,
    sets,
    points_difference,
    tie_break_points,
    team_one_name,
    team_two_name,
    team_one_color,
    team_two_color,
  }) => {
    setLoading(true);

    const body = {
      sets_number: parseInt(sets),
      set_points_number,
      points_difference,
      tie_break_points,
      teams: {
        team_one: {
          name: team_one_name ? team_one_name : 'Equipo A',
          color: fromHsv(team_one_color),
        },
        team_two: {
          name: team_two_name ? team_two_name : 'Equipo B',
          color: fromHsv(team_two_color),
        },
      },
    };

    let response;
    try {
      response = await axios.post('/matches/', body);
    } catch (error) {
      setLoading(false);
      return null;
    }
    setLoading(false);
    navigation.navigate('Match', {
      team_one_name: team_one_name,
      team_two_name: team_two_name,
      team_one_color: fromHsv(team_one_color),
      team_two_color: fromHsv(team_two_color),
      sets: sets,
      online: true,
      token: response.data.match.token,
      shareId: response.data.match.id,
    });
  };

  const createLocalMatch = async ({team_one_name, team_two_name, team_one_color, team_two_color, sets}) => {
    navigation.navigate('Match', {
      team_one_name: team_one_name ? team_one_name : 'Equipo A',
      team_two_name: team_two_name ? team_two_name : 'Equipo B',
      team_one_color: fromHsv(team_one_color),
      team_two_color: fromHsv(team_two_color),
      sets: sets,
      online: false,
    });
  };

  const handleCreateMatch = async values => {
    if (values.online_match) {
      createOnlineMatch(values);
    } else {
      createLocalMatch(values);
    }
  };

  return (
    <Container>
      {loading && (
        <>
          <Portal>
            <Modal visible={true} dismissable={false}>
              <ActivityIndicator animating={true} />
            </Modal>
          </Portal>
        </>
      )}
      <Formik
        initialValues={initialValues}
        validateOnMount={true}
        validationSchema={validationSchema}
        onSubmit={handleCreateMatch}
      >
        {({values, handleChange, handleSubmit, setFieldValue}) => {
          return (
            <>
              <TeamInputsContainer>
                <TeamInput
                  nameLabel="Equipo A"
                  nameValue={values.team_one_name}
                  onNameChange={handleChange('team_one_name')}
                  colorValue={values.team_one_color}
                  onColorChange={value => setFieldValue('team_one_color', value)}
                />
                <TeamInput
                  nameLabel="Equipo B"
                  nameValue={values.team_two_name}
                  onNameChange={handleChange('team_two_name')}
                  colorValue={values.team_two_color}
                  onColorChange={value => setFieldValue('team_two_color', value)}
                />
              </TeamInputsContainer>
              <WidthContainer>
                <Divider />
                <RadioButton.Group onValueChange={value => setFieldValue('sets', value)} value={values.sets}>
                  <RadioButton.Item label="Al mejor de 1 set" value="1" />
                  <RadioButton.Item label="Al mejor de 3 sets" value="3" />
                  <RadioButton.Item label="Al mejor de 5 sets" value="5" />
                </RadioButton.Group>
                <Divider />
                <Switch
                  label={'Partido online'}
                  value={values.online_match}
                  onValueChange={value => setFieldValue('online_match', value)}
                />
                <Button mode="contained" text="Crear partido" onPress={handleSubmit} />
              </WidthContainer>
            </>
          );
        }}
      </Formik>
      <AdBanner />
    </Container>
  );
};

export default NewMatch;
