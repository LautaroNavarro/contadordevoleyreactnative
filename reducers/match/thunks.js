import {createAsyncThunk} from '@reduxjs/toolkit';

import MatchService from './MatchService';

export const createMatch = createAsyncThunk('match/create', async params => {
  const response = await MatchService.createMatch(params);
  return response;
});
