import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  instance: null,
};

const PLAYING_STATUS = 'PLAYING';
const FINISHED_STATUS = 'FINISHED';
const DEFAULT_SETS_NUMBER = 5;
const DEFAULT_SET_POINTS_NUMBER = 25;
const DEFAULT_POINTS_DIFFERENCE = 2;
const DEFAULT_TIE_BREAK_POINTS = 15;
const TEAM_ONE = 'team_one';
const TEAM_TWO = 'team_two';

const generateSet = () => {
  return {
    'team_one': 0,
    'team_two': 0,
    'winner': null,
  }
}

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    cleanMatch: (state) => {
      state.instance = null;
    },
    setMatch: (state, action) => {
      action.payload.sets = [generateSet()];
      action.payload.teams.team_one.sets = action.payload.teams.team_one.sets ? action.payload.teams.team_one.sets : 0;
      action.payload.teams.team_two.sets = action.payload.teams.team_two.sets ? action.payload.teams.team_two.sets : 0;
      action.payload.sets_number = action.payload.sets_number ? action.payload.sets_number : DEFAULT_SETS_NUMBER;
      action.payload.set_points_number = action.payload.set_points_number ? action.payload.set_points_number : DEFAULT_SET_POINTS_NUMBER;
      action.payload.points_difference = action.payload.points_difference ? action.payload.points_difference : DEFAULT_POINTS_DIFFERENCE;
      action.payload.tie_break_points = action.payload.tie_break_points ? action.payload.tie_break_points : DEFAULT_TIE_BREAK_POINTS;
      action.payload.status = action.payload.status ? action.payload.status : PLAYING_STATUS;
      action.payload.winner = action.payload.winner ? action.payload.winner : null;

      state.instance = action.payload;
    },
    addPointTeam: (state, action) => {
      const team = action.payload;
      if (state.instance && state.instance.status !== FINISHED_STATUS) {
        let team_points = team === 1 ? 'team_one' : 'team_two';
        let other_team_points = team !== 1 ? 'team_one' : 'team_two';
        let index = state.instance.sets.length - 1;
        state.instance.sets[index][team_points] = state.instance.sets[index][team_points] + 1;
        if (
            state.instance.sets[index][team_points] >= (state.instance.sets[index][other_team_points] + state.instance.points_difference ) &&
            state.instance.sets[index][team_points] >= state.instance.set_points_number || 
            state.instance.sets.length === (state.instance.sets_number) && state.instance.sets[index][team_points] >= (state.instance.sets[index][other_team_points] + state.instance.points_difference ) &&
            state.instance.sets[index][team_points] >= state.instance.tie_break_points
        ) {
            // The set finished?

            state.instance.teams[team_points].sets = state.instance.teams[team_points].sets + 1; // Register that the team win a set
            state.instance.sets[index].winner = team_points; // Register that state set was winned by the team

            if (
                state.instance.teams[team_points].sets >= Math.ceil(state.instance.sets_number / 2)
            ){
                // The match finished?
                state.instance.status = FINISHED_STATUS;
                state.instance.winner = team_points;
            } else {
                // Create new set
                state.instance.sets.push(generateSet());
            }
        }
      }
    },
    substractPointTeam: (state, action) => {
      const team = action.payload;
      if (state.instance && state.instance.status !== FINISHED_STATUS) {
        let index = state.instance.sets.length - 1;
        let team_points = team === 1 ? 'team_one' : 'team_two';
        if (state.instance.sets[index][team_points] === 0){
            if (state.instance.sets.length !== 1){
              state.instance.sets.pop();
              let index = state.instance.sets.length - 1;
              state.instance.teams[state.instance.sets[index].winner].sets = state.instance.teams[state.instance.sets[index].winner].sets - 1;
              state.instance.sets[index][state.instance.sets[index].winner] = state.instance.sets[index][state.instance.sets[index].winner] - 1;
              state.instance.sets[index].winner = null;
            }
        } else {
            state.instance.sets[index][team_points] = state.instance.sets[index][team_points] - 1;
        }
      }
    }
  },
  extraReducers: {
    match_update: (state, action) => {
      console.log(action);
      state.instance = action.payload;
    }
  }
});

export default matchSlice.reducer;

export const { cleanMatch, setMatch, addPointTeam, substractPointTeam } = matchSlice.actions;

export const selectMatch = state => state.match.instance;
