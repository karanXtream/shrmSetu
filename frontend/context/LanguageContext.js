import React, { createContext, useState, useCallback, useEffect } from 'react';
import i18n from '../config/i18n';
import { SUPPORTED_LANGUAGES } from '../config/i18n';

/**
 * LanguageContext
 * Provides global language state management across the entire app
 * 
 * Enables:
 * 1. Reading current language
 * 2. Switching languages globally
 * 3. Persisting language preference
 * 4. Triggering re-renders on language change
 */

export const LanguageContext = createContext();

export const LanguageProvider = ({ children, initialLanguage = 'en' }) => {
  const [language, setLanguage] = useState(initialLanguage);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize i18n on mount
  useEffect(() => {
    const initI18n = async () => {
      try {
        await i18n.changeLanguage(language);
        setIsLoading(false);
      } catch (error) {
        console.error('i18n initialization error:', error);
        setIsLoading(false);
      }
    };

    initI18n();
  }, [language]);

  const changeLanguage = useCallback((newLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(newLanguage)) {
      setLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
    } else {
      console.warn(`Language '${newLanguage}' is not supported. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`);
    }
  }, []);

  const value = {
    language,
    changeLanguage,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
