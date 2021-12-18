import socketIOClient from "socket.io-client";

import {
  socketConnected,
  socketDisconnected,
  socketError,
  socketSubscribe,
} from './socket.actions';

import { subscribeToTopic } from './socket.actions';

const onClose = store => () => {
  store.dispatch(socketDisconnected());
};

const onConnect = (store) => () => {
  store.dispatch(socketConnected());
};

const onError = store => () => {
  // store.dispatch(socketError(e.headers.message));
  store.dispatch(socketDisconnected());
};

const onMessage = (store, onMessageAction) => (type, message) => {
  console.log('MESSAGE RECEIVE')
  console.log(type);
  console.log(message);
  store.dispatch(onMessageAction({
    type: type,
    message: message,
  }));
};

const socketMiddleware = () => {

  let socket = null;

  return store => next => async action => {
    switch (action.type) {
      case 'WS_CONNECT': {

        const { onMessageAction } = action.payload;

        if (socket !== null) {
          socket.disconnect(true);
        }

        socket = socketIOClient('https://contadordevoleybejs.herokuapp.com/');

        socket.on(
          'connect',
          () => {
            onConnect(store);
          }
        );

        socket.on(
          'connect_error',
          (data) => {
            onError(store);
          }
        );

        socket.on(
          'disconnect',
          () => {
            onClose(store);
          }
        );

        socket.onAny(
          onMessage(store, onMessageAction)
        );

        break;
      }
      case 'WS_EMIT_MESSAGE': {

        const { destination, body } = action.payload;
        if(!socket){
          store.dispatch(socketDisconnected());
          return;
        }

        socket.emit(
          destination,
          body
        );

        // store.dispatch(socketSubscribe(topic));

        break;
      }
      case 'WS_DISCONNECT': {
        if (socket !== null) {
          socket.disconnect(true);
        }
        socket = null;
        break;
      }
      // case 'NEW_MESSAGE': {
      //   let { destination, body } = action.payload;
      //   socket.publish({
      //     destination,
      //     body: JSON.stringify(body),
      //   });
      //   break;
      // }
      default:
        return next(action);
    }
  };
};

export default socketMiddleware;
