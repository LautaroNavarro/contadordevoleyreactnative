const apiReducerBuilder = (builder, thunk) => {
  return builder
    .addCase(thunk.pending, state => {
      state.loading = true;
    })
    .addCase(thunk.fulfilled, (state, action, fulfilledCb) => {
      state.loading = false;
      if (fulfilledCb) {
        fulfilledCb(state, action);
      }
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ? action.payload : action.error;
    });
};

export default apiReducerBuilder;