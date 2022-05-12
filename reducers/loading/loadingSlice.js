import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  display: false,
  text: null,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    displayLoading: (state, action) => {
      state.display = action.payload.display;
      state.text = action.payload.text;
    },
  },
});

export default loadingSlice.reducer;

export const {displayLoading} = loadingSlice.actions;

export const selectLoadingDisplay = state => state.loading.display;
export const selectLoadingText = state => state.loading.text;
