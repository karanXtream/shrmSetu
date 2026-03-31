import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../hooks/use-translation';

/**
 * LanguageSwitcher Component
 * Provides a simple UI to switch between supported languages
 * 
 * Can be used:
 * 1. In a settings screen
 * 2. In a header
 * 3. In a modal/drawer
 * 4. As a standalone component anywhere in the app
 */

export const LanguageSwitcher = ({ layout = 'button', onLanguageChange = null }) => {
  const { language, changeLanguage, supportedLanguages } = useLanguage();

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  const getLanguageName = (lang) => {
    switch (lang) {
      case 'en':
        return 'English';
      case 'hi':
        return 'हिंदी';
      default:
        return lang.toUpperCase();
    }
  };

  if (layout === 'button') {
    return (
      <View style={styles.buttonContainer}>
        {supportedLanguages.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.languageButton,
              language === lang ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={() => handleLanguageChange(lang)}
          >
            <Text
              style={[
                styles.buttonText,
                language === lang ? styles.activeText : styles.inactiveText,
              ]}
            >
              {getLanguageName(lang)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  if (layout === 'inline') {
    return (
      <View style={styles.inlineContainer}>
        <Text style={styles.label}>Language: </Text>
        {supportedLanguages.map((lang, index) => (
          <React.Fragment key={lang}>
            <TouchableOpacity onPress={() => handleLanguageChange(lang)}>
              <Text
                style={[
                  styles.inlineText,
                  language === lang ? styles.inlineActive : styles.inlineInactive,
                ]}
              >
                {getLanguageName(lang)}
              </Text>
            </TouchableOpacity>
            {index < supportedLanguages.length - 1 && <Text style={styles.separator}> | </Text>}
          </React.Fragment>
        ))}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  inactiveButton: {
    backgroundColor: '#F0F0F0',
    borderColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#333333',
  },

  // Inline styles
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  inlineText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 5,
  },
  inlineActive: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  inlineInactive: {
    color: '#666666',
  },
  separator: {
    color: '#999999',
    marginHorizontal: 3,
  },
});
