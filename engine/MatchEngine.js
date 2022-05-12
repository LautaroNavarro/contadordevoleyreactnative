export const PLAYING_STATUS = 'PLAYING';
export const FINISHED_STATUS = 'FINISHED';
export const DEFAULT_SETS_NUMBER = 5;
export const DEFAULT_SET_POINTS_NUMBER = 25;
export const DEFAULT_POINTS_DIFFERENCE = 2;
export const DEFAULT_TIE_BREAK_POINTS = 15;
export const TEAM_ONE = 'team_one';
export const TEAM_TWO = 'team_two';

export const generateSet = () => {
  return {
    team_one: 0,
    team_two: 0,
    winner: null,
  };
};

export default class MatchEngine {
  constructor(matchJson) {
    this.teams = matchJson.teams;
    this.teams.team_one.sets = matchJson.teams.team_one.sets ? matchJson.teams.team_one.sets : 0;
    this.teams.team_two.sets = matchJson.teams.team_two.sets ? matchJson.teams.team_two.sets : 0;
    this.sets_number = matchJson.sets_number ? matchJson.sets_number : DEFAULT_SETS_NUMBER;
    this.set_points_number = matchJson.set_points_number ? matchJson.set_points_number : DEFAULT_SET_POINTS_NUMBER;
    this.points_difference = matchJson.points_difference ? matchJson.points_difference : DEFAULT_POINTS_DIFFERENCE;
    this.tie_break_points = matchJson.tie_break_points ? matchJson.tie_break_points : DEFAULT_TIE_BREAK_POINTS;
    this.status = matchJson.status ? matchJson.status : PLAYING_STATUS;
    this.sets = [generateSet()];
    this.winner = matchJson.winner ? matchJson.winner : null;
  }

  static json() {
    return {
      teams: this.teams,
      sets_number: this.sets_number,
      set_points_number: this.set_points_number,
      points_difference: this.points_difference,
      tie_break_points: this.tie_break_points,
      status: this.status,
      sets: this.sets,
      winner: this.winner,
    };
  }

  addPointTeam(team) {
    if (this.status === FINISHED_STATUS) {
      return false;
    }
    let team_points = team === 1 ? 'team_one' : 'team_two';
    let other_team_points = team !== 1 ? 'team_one' : 'team_two';
    let index = this.sets.length - 1;
    this.sets[index][team_points] = this.sets[index][team_points] + 1;
    if (
      (this.sets[index][team_points] >= this.sets[index][other_team_points] + this.points_difference &&
        this.sets[index][team_points] >= this.set_points_number) ||
      (this.sets.length === this.sets_number &&
        this.sets[index][team_points] >= this.sets[index][other_team_points] + this.points_difference &&
        this.sets[index][team_points] >= this.tie_break_points)
    ) {
      // The set finished?

      this.teams[team_points].sets = this.teams[team_points].sets + 1; // Register that the team win a set
      this.sets[index].winner = team_points; // Register that this set was winned by the team

      if (this.teams[team_points].sets >= Math.ceil(this.sets_number / 2)) {
        // The match finished?
        this.status = FINISHED_STATUS;
        this.winner = team_points;
      } else {
        // Create new set
        this.sets.push(generateSet());
      }
    }
  }

  substractPointTeam(team) {
    if (this.status === FINISHED_STATUS) {
      return false;
    }
    let index = this.sets.length - 1;
    let team_points = team === 1 ? 'team_one' : 'team_two';
    if (this.sets[index][team_points] === 0) {
      if (this.sets.length === 1) {
        return false;
      }
      this.sets.pop();
      let index = this.sets.length - 1;
      this.teams[this.sets[index].winner].sets = this.teams[this.sets[index].winner].sets - 1;
      this.sets[index][this.sets[index].winner] = this.sets[index][this.sets[index].winner] - 1;
      this.sets[index].winner = null;
    } else {
      this.sets[index][team_points] = this.sets[index][team_points] - 1;
    }
  }
}
