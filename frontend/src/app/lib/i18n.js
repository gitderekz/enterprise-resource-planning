import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../../public/locales/en/common.json';
import fr from '../../../public/locales/fr/common.json';
import sw from '../../../public/locales/sw/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;