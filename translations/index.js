import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import {selectSelectedLanguage} from './../reducers/language/languageSlice';
import en from './en';
import es from './es';

const resources = {
  en,
  es,
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const TranslationProvider = ({children}) => {
  const selectedLanguage = useSelector(selectSelectedLanguage);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  return children;
};

export default TranslationProvider;
