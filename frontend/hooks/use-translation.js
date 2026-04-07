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

  const toReadableText = (key) => {
    const lastSegment = String(key || '')
      .split('.')
      .pop()
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();

    if (!lastSegment) {
      return '';
    }

    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (key, options = {}) => {
    const translated = t(key, options);

    if (translated && translated !== key) {
      return translated;
    }

    if (typeof options.defaultValue === 'string' && options.defaultValue.trim()) {
      return options.defaultValue;
    }

    return toReadableText(key);
  };
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
