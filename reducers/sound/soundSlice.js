import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  enabled: true,
};

export const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    changeEnabled: (state) => {
      state.enabled = !state.enabled;
    },
  },
});

export default soundSlice.reducer;

export const { changeEnabled } = soundSlice.actions;

export const selectSoundEnabled = state => state.sound.enabled;

