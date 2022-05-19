import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';

import {displayLoading} from './../reducers/loading/loadingSlice';

export const useSyncEndpointCall = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation('global');

  return async ({
    loadingText,
    reduxAction,
    errorText = false,
    successText = false,
    successCallback = () => {},
    errorCallBack = () => {},
  }) => {
    dispatch(displayLoading({display: true, text: loadingText}));
    const resp = await dispatch(reduxAction);
    dispatch(displayLoading({display: false}));
    if (resp.error) {
      const errorKey = resp?.payload?.message ? resp?.payload?.message : resp?.error?.message;
      const errorMessage = t(`errors.${errorKey}`, errorText);
      errorCallBack(resp);
      if (errorMessage) {
        Toast.show({
          type: 'error',
          text1: resp.error,
        });
      }
    } else {
      if (successText) {
        Toast.show({
          type: 'success',
          text1: successText,
        });
      }
      successCallback(resp);
    }
  };
};

export default useSyncEndpointCall;
