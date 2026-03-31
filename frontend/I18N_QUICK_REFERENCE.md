# i18n Quick Reference

## Import Statements

```javascript
// For using translations
import { useTranslation } from '@/hooks/use-translation';

// For language switching
import { useLanguage } from '@/hooks/use-translation';

// For using the language switcher component
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
```

---

## Using Translations in Components

### Basic Usage
```jsx
const t = useTranslation();
<Text>{t('home.title')}</Text>
```

### With Interpolation (Variables)
```jsx
const t = useTranslation();
const userName = 'John';
<Text>{t('messages.welcome_user', { name: userName })}</Text>
```

### Access Current Language
```jsx
const { language } = useLanguage();
console.log(language); // 'en' or 'hi'
```

---

## Language Switching

### Using LanguageSwitcher Component
```jsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Button layout (recommended)
<LanguageSwitcher layout="button" />

// Inline layout
<LanguageSwitcher layout="inline" />
```

### Programmatic Language Change
```jsx
const { changeLanguage } = useLanguage();

// Switch to Hindi
changeLanguage('hi');

// Switch to English
changeLanguage('en');
```

### With Callback
```jsx
<LanguageSwitcher 
  layout="button" 
  onLanguageChange={(lang) => {
    console.log('Language changed to:', lang);
  }} 
/>
```

---

## Adding Translations

### 1. Update Translation Files

**`locales/en/translation.json`**
```json
{
  "feature_name": {
    "button_label": "Click me",
    "success_message": "Done!"
  }
}
```

**`locales/hi/translation.json`**
```json
{
  "feature_name": {
    "button_label": "मुझे क्लिक करें",
    "success_message": "हो गया!"
  }
}
```

### 2. Use in Component
```jsx
const t = useTranslation();

<TouchableOpacity>
  <Text>{t('feature_name.button_label')}</Text>
</TouchableOpacity>

// Alerts
Alert.alert('Success', t('feature_name.success_message'));
```

---

## Adding a New Language (Spanish Example)

### Step 1: Create File
Create `locales/es/translation.json` with all translations:
```json
{
  "common": { "app_name": "Shrm Setu" },
  "home": { "title": "Pantalla de inicio" },
  ...
}
```

### Step 2: Update Config
Update `config/i18n.js`:
```javascript
import esTranslation from '../locales/es/translation.json';

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'es'];

export const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  es: { translation: esTranslation }, // ADD THIS
};
```

### Done!
Language switcher automatically shows Spanish option. No other changes needed.

---

## Common Patterns

### Error Messages
```jsx
const t = useTranslation();
const [error, setError] = useState(null);

if (error) {
  <Text>{t(`errors.${error}`)}</Text>
}
```

### Translations in Arrays
```jsx
const t = useTranslation();

const items = [
  { label: t('buttons.save') },
  { label: t('buttons.cancel') },
  { label: t('buttons.delete') },
];
```

### Translations in Navigate
```jsx
import { useTranslation } from '@/hooks/use-translation';
import { useRouter } from 'expo-router';

export default function Screen() {
  const t = useTranslation();
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push('/profile')}>
      <Text>{t('navigation.profile')}</Text>
    </TouchableOpacity>
  );
}
```

### Form Labels
```jsx
const t = useTranslation();

<View>
  <Text>{t('form.email_label')}</Text>
  <TextInput placeholder={t('form.email_placeholder')} />
  
  <Text>{t('form.password_label')}</Text>
  <TextInput placeholder={t('form.password_placeholder')} />
</View>
```

---

## Useful i18next Methods

```javascript
import i18next from 'i18next';

// Get current language
const lang = i18next.language; // 'en' or 'hi'

// Check if language is loaded
const isLoaded = i18next.isInitialized; // boolean

// Get all translations for current language
const allTranslations = i18next.getResourceBundle(i18next.language);

// Check if key exists
const hasKey = i18next.exists('home.title');
```

---

## Translation File Template

When creating translation files, use this structure:

```json
{
  "common": {
    "app_name": "",
    "welcome": "",
    "yes": "",
    "no": ""
  },
  "home": {
    "title": "",
    "subtitle": ""
  },
  "navigation": {
    "home": "",
    "next": "",
    "back": ""
  },
  "buttons": {
    "save": "",
    "cancel": "",
    "delete": ""
  },
  "messages": {
    "loading": "",
    "error": "",
    "success": ""
  },
  "form": {
    "email_label": "",
    "password_label": "",
    "validation_error": ""
  }
}
```

---

## Debugging

### Check if Hook Works
```jsx
const t = useTranslation();
console.log(t('home.title')); // Should print translated text or key
```

### Check Current Language
```jsx
const { language } = useLanguage();
console.log('Current language:', language);
```

### Check Language Context
```jsx
const context = useContext(LanguageContext);
console.log('Language context:', context);
```

### Verify Translations Loaded
```jsx
import i18next from 'i18next';
console.log('Initialized:', i18next.isInitialized);
console.log('Current language:', i18next.language);
```

---

## Performance Tips

1. **Don't create hooks inside loops**
   ```jsx
   // ❌ BAD
   {items.map(item => {
     const t = useTranslation();
     return <Text>{t('key')}</Text>;
   })}

   // ✅ GOOD
   const t = useTranslation();
   {items.map(item => <Text>{t('key')}</Text>)}
   ```

2. **Memoize translated lists**
   ```jsx
   const t = useTranslation();
   const options = useMemo(() => [
     { label: t('common.yes') },
     { label: t('common.no') }
   ], [t]);
   ```

3. **Avoid inline object creation**
   ```jsx
   // ❌ BAD
   {t('message', { name: userName, age: userAge })}

   // ✅ GOOD (if many variables)
   const variables = { name: userName, age: userAge };
   {t('message', variables)}
   ```

---

## Supported Languages

Currently Supported:
- 🇬🇧 English (`en`)
- 🇮🇳 Hindi (`hi`)

To add more, follow the "Adding a New Language" section above.

---

## Troubleshooting Checklist

- [ ] Is `LanguageProvider` wrapping the entire app in `_layout.jsx`?
- [ ] Did you run `npm install i18next i18next-react-native-async-storage`?
- [ ] Are translation keys spelled correctly?
- [ ] Are JSON files valid (use JSONLint to verify)?
- [ ] Did you create translations for ALL languages?
- [ ] Did you update `config/i18n.js` when adding a language?
- [ ] Are component imports using `@/` alias correctly?
