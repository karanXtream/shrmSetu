import { useContext } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { LanguageContext } from '../context/LanguageContext';

/**
 * useTranslation Hook
 * Provides a simple interface to access translations in any component
 * 
 * Usage in components:
 *   const t = useTranslation();
 *   <Text>{t('home.title')}</Text>
 */

export const useTranslation = () => {
  const { t } = useI18nextTranslation();
  const languageContext = useContext(LanguageContext);

  if (!languageContext) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  // Return i18next's t function directly for simplicity
  return t;
};

/**
 * useLanguage Hook
 * Provides access to the current language and language switching functionality
 * 
 * Usage:
 *   const { language, changeLanguage } = useLanguage();
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
