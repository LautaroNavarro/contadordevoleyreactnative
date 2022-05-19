import React from 'react';
import styled from 'styled-components';
import {ScrollView} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {fromHsv} from 'react-native-color-picker';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useTranslation} from 'react-i18next';

import AdBanner from './../../components/Ads/AdBanner';
import Container from './../../components/Container/Container';
import Switch from './../../components/Inputs/Switch';
import WidthContainer from './../../components/Container/WidthContainer';
import Button from './../../components/Buttons/Button';
import Divider from './../../components/Divider/Divider';
import TeamInput from './components/TeamInput';
import useSyncEndpointCall from './../../utils/syncEndpointCall.js';
import {createMatch} from './../../reducers/match/thunks';

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
  const {t} = useTranslation();
  const syncEndpointCall = useSyncEndpointCall();

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
    const body = {
      sets_number: parseInt(sets),
      set_points_number,
      points_difference,
      tie_break_points,
      teams: {
        team_one: {
          name: team_one_name ? team_one_name : t('team_a'),
          color: fromHsv(team_one_color),
        },
        team_two: {
          name: team_two_name ? team_two_name : t('team_b'),
          color: fromHsv(team_two_color),
        },
      },
    };
    syncEndpointCall({
      loadingText: t('creating_match'),
      reduxAction: createMatch({
        ...body,
      }),
      errorText: t('there_was_an_error_creating_your_match'),
      successText: false,
      successCallback: response => {
        navigation.navigate('Match', {
          team_one_name: team_one_name,
          team_two_name: team_two_name,
          team_one_color: fromHsv(team_one_color),
          team_two_color: fromHsv(team_two_color),
          sets: sets,
          online: true,
          token: response.payload.match.token,
          shareId: response.payload.match.id,
        });
      },
    });
  };

  const createLocalMatch = async ({team_one_name, team_two_name, team_one_color, team_two_color, sets}) => {
    navigation.navigate('Match', {
      team_one_name: team_one_name ? team_one_name : t('team_a'),
      team_two_name: team_two_name ? team_two_name : t('team_b'),
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
      <ScrollView>
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
                    nameLabel={t('team_a')}
                    nameValue={values.team_one_name}
                    onNameChange={handleChange('team_one_name')}
                    colorValue={values.team_one_color}
                    onColorChange={value => setFieldValue('team_one_color', value)}
                  />
                  <TeamInput
                    nameLabel={t('team_b')}
                    nameValue={values.team_two_name}
                    onNameChange={handleChange('team_two_name')}
                    colorValue={values.team_two_color}
                    onColorChange={value => setFieldValue('team_two_color', value)}
                  />
                </TeamInputsContainer>
                <WidthContainer>
                  <Divider />
                  <RadioButton.Group onValueChange={value => setFieldValue('sets', value)} value={values.sets}>
                    <RadioButton.Item label={t('best_of_sets', {sets: 1})} value="1" />
                    <RadioButton.Item label={t('best_of_sets', {sets: 3})} value="3" />
                    <RadioButton.Item label={t('best_of_sets', {sets: 5})} value="5" />
                  </RadioButton.Group>
                  <Divider />
                  <Switch
                    label={t('online_match')}
                    value={values.online_match}
                    onValueChange={value => setFieldValue('online_match', value)}
                  />
                  <Button mode="contained" text={t('create_match')} onPress={handleSubmit} />
                </WidthContainer>
              </>
            );
          }}
        </Formik>
      </ScrollView>
      <AdBanner />
    </Container>
  );
};

export default NewMatch;
