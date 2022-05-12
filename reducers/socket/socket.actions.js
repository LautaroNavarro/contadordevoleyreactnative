export const handleSocketMessage = socketMessage => {
  return dispatch => {
    dispatch({type: socketMessage.type, payload: socketMessage.message});
  };
};

export const connectToSocket = () => ({
  type: 'WS_CONNECT',
  payload: {
    onMessageAction: handleSocketMessage,
  },
});

export const emitMessage = ({destination, body}) => ({
  type: 'WS_EMIT_MESSAGE',
  payload: {
    destination,
    body,
  },
});

export const disconnectSocket = () => ({
  type: 'WS_DISCONNECT',
  payload: {},
});
