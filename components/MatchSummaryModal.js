import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Modal, Divider, DataTable} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  modal: {
    opacity: 0.8,
    borderRadius: 15,
    backgroundColor: 'grey',
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
});

class MatchSummaryModal extends Component {
  getLosserTeam() {
    if (this.props.match.winner === 'team_one') {
      return this.props.match.teams.team_two;
    } else {
      return this.props.match.teams.team_one;
    }
  }

  getSetsRendered() {
    let setsRendered = [];
    for (var i = 0; i < this.props.match.sets.length; i++) {
      setsRendered.push(
        <DataTable.Row key={`set-${i}`}>
          <DataTable.Cell>{i + 1}</DataTable.Cell>
          <DataTable.Cell>{this.props.match.sets[i].team_one}</DataTable.Cell>
          <DataTable.Cell>{this.props.match.sets[i].team_two}</DataTable.Cell>
        </DataTable.Row>,
      );
    }
    return setsRendered;
  }
  render() {
    return (
      <Modal visible={this.props.visible} onDismiss={this.props.onDismiss} contentContainerStyle={styles.modal}>
        <View>
          <Text style={{fontSize: 20}}>{`${this.props.match.teams[this.props.match.winner].name} le ganó a ${
            this.getLosserTeam().name
          } `}</Text>
          <Text>{`${this.props.match.teams[this.props.match.winner].sets} a ${this.getLosserTeam().sets}`}</Text>
          <Divider style={{marginTop: 10, marginBottom: 10, paddingTop: 3}} />
          <Text>Detalles de sets</Text>
          <View style={{width: wp('80%')}}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>#</DataTable.Title>
                <DataTable.Title>{this.props.match.teams[this.props.match.winner].name}</DataTable.Title>
                <DataTable.Title>{this.getLosserTeam().name}</DataTable.Title>
              </DataTable.Header>
            </DataTable>
            {this.getSetsRendered()}
          </View>
        </View>
      </Modal>
    );
  }
}

export default MatchSummaryModal;
