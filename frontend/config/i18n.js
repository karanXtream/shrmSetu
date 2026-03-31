import i18next from 'i18next';
import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/translation.json';

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

export const SUPPORTED_LANGUAGES = ['en', 'hi'];

export const resources = {
  en: {
    translation: enTranslation,
  },
  hi: {
    translation: hiTranslation,
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
