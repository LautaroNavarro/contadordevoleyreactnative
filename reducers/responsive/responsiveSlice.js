import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isPortrait: true,
};

export const responsiveSlice = createSlice({
  name: 'responsive',
  initialState,
  reducers: {
    setIsPortrait: (state, action) => {
      state.isPortrait = action.payload;
    },
  },
});

export default responsiveSlice.reducer;

export const {setIsPortrait} = responsiveSlice.actions;

export const selectIsPortrait = state => state.responsive.isPortrait;
