import i18next from 'i18next';
import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/translation.json';
import bnTranslation from '../locales/bn/translation.json';
import teTranslation from '../locales/te/translation.json';
import mrTranslation from '../locales/mr/translation.json';
import taTranslation from '../locales/ta/translation.json';
import guTranslation from '../locales/gu/translation.json';
import knTranslation from '../locales/kn/translation.json';
import mlTranslation from '../locales/ml/translation.json';
import thTranslation from '../locales/th/translation.json';
import viTranslation from '../locales/vi/translation.json';
import idTranslation from '../locales/id/translation.json';

/**
 * i18n Configuration
 * Centralizes all i18next setup including resource loading and language settings
 * 
 * Scalable design: Adding a new language requires:
 * 1. Create locales/{lang}/translation.json
 * 2. Import the JSON file here
 * 3. Add to resources object: {lang}: {translation: imported_translation}
 * 4. Update SUPPORTED_LANGUAGES array
 * 5. No other files need modification
 */

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'th', 'vi', 'id'];

export const resources = {
  en: {
    translation: enTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
  bn: {
    translation: bnTranslation,
  },
  te: {
    translation: teTranslation,
  },
  mr: {
    translation: mrTranslation,
  },
  ta: {
    translation: taTranslation,
  },
  gu: {
    translation: guTranslation,
  },
  kn: {
    translation: knTranslation,
  },
  ml: {
    translation: mlTranslation,
  },
  th: {
    translation: thTranslation,
  },
  vi: {
    translation: viTranslation,
  },
  id: {
    translation: idTranslation,
  },
};

export const initializeI18n = async (userLanguage = 'en') => {
  if (i18next.isInitialized) {
    return;
  }

  await i18next.init({
    lng: userLanguage,
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false, // Not needed for React Native
    },
    compatibilityJSON: 'v3',
  });

  return i18next;
};

export default i18next;
