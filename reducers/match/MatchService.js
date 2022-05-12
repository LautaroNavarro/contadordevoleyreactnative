import axios from 'axios';

export default class MatchService {
  static async createMatch(body) {
    const {data} = await axios.post('/matches/', body);
    return data;
  }
}
