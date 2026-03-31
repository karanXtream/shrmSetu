# Internationalization (i18n) System Documentation

## Overview

This is a scalable, production-ready i18n system for the Shrm Setu Expo React Native app using **i18next**. The system is designed to be:

- **Modular**: Add new languages without modifying core logic
- **Clean**: No hardcoded text in components
- **Maintainable**: Centralized translation management
- **Scalable**: Easily extend from 2 to 10+ languages

---

## Architecture

### Folder Structure

```
frontend/
├── locales/                          # Translation files
│   ├── en/
│   │   └── translation.json         # English translations
│   └── hi/
│       └── translation.json         # Hindi translations
│
├── config/
│   └── i18n.js                      # i18next initialization & configuration
│
├── context/
│   └── LanguageContext.js           # Global language state management
│
├── hooks/
│   └── use-translation.js           # Custom hooks for accessing translations
│
├── components/
│   └── LanguageSwitcher.jsx         # Language selection UI component
│
└── app/
    ├── _layout.jsx                  # Root layout (wraps with LanguageProvider)
    └── (tabs)/
        └── index.jsx                # Example usage in a screen
```

---

## Component Breakdown

### 1. **Translation Files** (`locales/{lang}/translation.json`)

Each language has a JSON file containing all translatable text organized by features/domains.

**Structure Pattern:**
```json
{
  "domain": {
    "key": "text",
    "nested_key": "text"
  }
}
```

**Example (English):**
```json
{
  "common": {
    "app_name": "Shrm Setu"
  },
  "home": {
    "title": "Home Screen",
    "welcome_message": "Welcome to Shrm Setu"
  }
}
```

**Example (Hindi):**
```json
{
  "common": {
    "app_name": "श्रम सेतु"
  },
  "home": {
    "title": "होम स्क्रीन",
    "welcome_message": "श्रम सेतु में आपका स्वागत है"
  }
}
```

---

### 2. **i18n Configuration** (`config/i18n.js`)

Initializes i18next with all language resources and settings.

**Key Features:**
- Imports all translation JSON files
- Defines supported languages
- Configures i18next with fallback language (English)
- Provides `initializeI18n()` function for app startup

**Usage:**
```javascript
import { initializeI18n, SUPPORTED_LANGUAGES } from '@/config/i18n';

// In app startup
await initializeI18n('en');
```

---

### 3. **Language Context** (`context/LanguageContext.js`)

Manages global language state using React Context API.

**Provides:**
- Current language state
- `changeLanguage()` function
- Loading state
- Supported languages list

**Consumer Access:**
```javascript
import { useLanguage } from '@/hooks/use-translation';

const { language, changeLanguage, supportedLanguages } = useLanguage();
```

---

### 4. **Translation Hooks** (`hooks/use-translation.js`)

Two custom hooks for cleaner component integration:

**Hook 1: `useTranslation()`**
- Returns i18next's `t` function
- Used for translating text

```javascript
import { useTranslation } from '@/hooks/use-translation';

const t = useTranslation();
<Text>{t('home.title')}</Text>
```

**Hook 2: `useLanguage()`**
- Returns language context
- Used for accessing/switching language

```javascript
import { useLanguage } from '@/hooks/use-translation';

const { language, changeLanguage } = useLanguage();
```

---

### 5. **Language Switcher Component** (`components/LanguageSwitcher.jsx`)

Pre-built UI component for language selection.

**Features:**
- Two layout options: `"button"` and `"inline"`
- Shows all supported languages
- Automatically styled
- Optional callback on language change

**Usage in Button Layout:**
```jsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher layout="button" onLanguageChange={(lang) => console.log(lang)} />
```

**Result:**
```
[English] [हिंदी]
```

**Usage in Inline Layout:**
```jsx
<LanguageSwitcher layout="inline" />
```

**Result:**
```
Language: English | हिंदी
```

---

### 6. **Root Layout** (`app/_layout.jsx`)

Initializes i18n on app startup and wraps the entire app with `LanguageProvider`.

**Key Changes:**
1. Imports i18n configuration
2. Calls `initializeI18n()` in useEffect
3. Wraps Stack navigator with `LanguageProvider`

```jsx
import { LanguageProvider } from '@/context/LanguageContext';
import { initializeI18n } from '@/config/i18n';

export default function RootLayout() {
  useEffect(() => {
    await initializeI18n('en');
  }, []);

  return (
    <LanguageProvider initialLanguage="en">
      {/* App navigation */}
    </LanguageProvider>
  );
}
```

---

## Usage in Components

### Basic Example (Home Screen)

```jsx
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation, useLanguage } from '@/hooks/use-translation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function HomeScreen() {
  const t = useTranslation();
  const { language } = useLanguage();

  return (
    <View style={styles.container}>
      <Text>{t('home.title')}</Text>
      <Text>{t('home.welcome_message')}</Text>
      <Text>Current Language: {language}</Text>
      
      <LanguageSwitcher layout="button" />
    </View>
  );
}
```

### Another Screen Example

```jsx
import { Text, View, TouchableOpacity } from 'react-native';
import { useTranslation, useLanguage } from '@/hooks/use-translation';

export default function ProfileScreen() {
  const t = useTranslation();
  const { changeLanguage } = useLanguage();

  return (
    <View>
      <Text>{t('common.app_name')}</Text>
      <TouchableOpacity onPress={() => changeLanguage('hi')}>
        <Text>{t('buttons.next')}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Adding New Translations

### Step 1: Update Translation Files

Add new keys to both English and Hindi translation files:

**`locales/en/translation.json`:**
```json
{
  "profile": {
    "title": "Profile",
    "edit_bio": "Edit Bio"
  }
}
```

**`locales/hi/translation.json`:**
```json
{
  "profile": {
    "title": "प्रोफाइल",
    "edit_bio": "जीवनी संपादित करें"
  }
}
```

### Step 2: Use in Component

```jsx
const t = useTranslation();
<Text>{t('profile.title')}</Text>
<Text>{t('profile.edit_bio')}</Text>
```

---

## Scaling: Adding a New Language

The system is designed for easy scaling. To add **Spanish (es)**:

### Step 1: Create Spanish Locale Folder

```
locales/es/
└── translation.json
```

### Step 2: Create Spanish Translation File

**`locales/es/translation.json`:**
```json
{
  "common": {
    "app_name": "Shrm Setu"
  },
  "home": {
    "title": "Pantalla de inicio",
    "welcome_message": "Bienvenido a Shrm Setu"
  },
  ...
}
```

### Step 3: Update Config File

**`config/i18n.js`:**
```javascript
import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/translation.json';
import esTranslation from '../locales/es/translation.json'; // ADD THIS

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'es']; // ADD 'es'

export const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  es: { translation: esTranslation }, // ADD THIS
};
```

### Step 4: Done!

The LanguageSwitcher automatically detects the new language and updates all components. **No other changes needed.**

---

## Best Practices

### 1. **Organization**
- Group translations by feature/domain
- Use clear, descriptive keys: `domain.feature.action`
- Example: `user.profile.edit_button` (NOT just `edit`)

### 2. **Consistency**
- Maintain the same key structure across all languages
- Always create translations for ALL languages before using in components
- Avoid partial translations

### 3. **Performance**
- i18n is initialized once in `_layout.jsx`
- Context re-renders only when language changes
- Translation lookup is O(1) (direct object access)

### 4. **Dynamic Content**
For dynamic content, use i18next interpolation:

**Translation file:**
```json
{
  "messages": {
    "welcome_user": "Welcome, {{name}}!"
  }
}
```

**Component:**
```jsx
const t = useTranslation();
<Text>{t('messages.welcome_user', { name: 'John' })}</Text>
// Output: "Welcome, John!"
```

### 5. **Fallback Strategy**
- Default language is English
- If a translation is missing, it falls back to English
- Missing translation appears as the key: `messages.welcome_user`

---

## Troubleshooting

### Issue: Translations Not Updating After Language Change

**Solution:** Ensure component is wrapped with `LanguageProvider` in root layout and uses `useTranslation()` hook.

### Issue: Missing Translation Key

**Solution:** Add the key to all translation JSON files or check for typos in the key path.

### Issue: i18n Not Initialized

**Solution:** Verify `initializeI18n()` is called in `app/_layout.jsx` before rendering components.

---

## File Summary

| File | Purpose |
|------|---------|
| `locales/en/translation.json` | English translations |
| `locales/hi/translation.json` | Hindi translations |
| `config/i18n.js` | i18next initialization & configuration |
| `context/LanguageContext.js` | Global language state |
| `hooks/use-translation.js` | Translation hooks |
| `components/LanguageSwitcher.jsx` | Language switcher UI |
| `app/_layout.jsx` | App root with i18n setup |

---

## Next Steps

1. ✅ System is ready to use
2. Test language switching on device/emulator
3. Add more screens using `useTranslation()` hook
4. When adding new features, remember to:
   - Add keys to translation JSON files
   - Use `t('key.path')` in components
5. To add more languages: Create new locale folder + update `config/i18n.js`

---

## Summary

- **2 Languages Set Up:** English & Hindi
- **Modular Design:** Add languages without code changes
- **No Hardcoded Text:** All text in JSON files
- **Global State:** Instant updates across app
- **Ready to Scale:** Add 10+ languages easily
