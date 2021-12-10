import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
};

export const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    addOne: (state) => {
      state.count = state.count + 1;
      console.log(state.count);
    },
  },
});

export default testSlice.reducer;

export const { addOne } = testSlice.actions;

export const selectTestCount = state => state.test.count;
