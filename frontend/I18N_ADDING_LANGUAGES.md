# Adding Languages - Step-by-Step Examples

This guide shows exactly how to add new languages to the system with real examples.

---

## Example 1: Adding Spanish (ES)

### Current Setup
- ✅ English (en)
- ✅ Hindi (hi)
- ❌ Spanish (es) - not yet

### Step 1: Create Folder

Create this folder structure:
```
locales/es/
└── translation.json
```

**Terminal Command:**
```bash
mkdir -p locales/es
```

### Step 2: Create Translation File

Create `locales/es/translation.json` with translations for ALL keys from English file:

```json
{
  "common": {
    "app_name": "Shrm Setu",
    "welcome": "Bienvenido",
    "hello": "Hola"
  },
  "home": {
    "title": "Pantalla de inicio",
    "welcome_message": "Bienvenido a Shrm Setu",
    "subtitle": "Comienza a explorar características increíbles",
    "description": "Este es un ejemplo de un componente traducible"
  },
  "language": {
    "select_language": "Seleccionar idioma",
    "english": "English",
    "hindi": "हिंदी",
    "language_selected": "Idioma cambiado al español"
  },
  "navigation": {
    "home": "Inicio",
    "explore": "Explorar",
    "back": "Atrás"
  },
  "buttons": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "continue": "Continuar",
    "next": "Siguiente",
    "previous": "Anterior",
    "close": "Cerrar"
  },
  "messages": {
    "loading": "Cargando...",
    "error": "Ocurrió un error",
    "success": "Éxito",
    "no_data": "Sin datos disponibles"
  }
}
```

### Step 3: Update Configuration

Edit `config/i18n.js`:

**BEFORE:**
```javascript
import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/translation.json';

export const SUPPORTED_LANGUAGES = ['en', 'hi'];

export const resources = {
  en: {
    translation: enTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
};
```

**AFTER:**
```javascript
import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/translation.json';
import esTranslation from '../locales/es/translation.json'; // ADD THIS LINE

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'es']; // ADD 'es'

export const resources = {
  en: {
    translation: enTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
  es: {
    translation: esTranslation, // ADD THIS BLOCK
  },
};
```

### Step 4: Test

✅ **Done!** No other changes needed.

The app now:
- Shows "Español" in language switcher
- Translates all text when Spanish is selected
- Automatically persists language preference

---

## Example 2: Adding French (FR) and German (DE)

Want to add French AND German? Same process, twice.

### Step 1: Create Folders

```bash
mkdir -p locales/fr
mkdir -p locales/de
```

### Step 2: Create Translation Files

Create `locales/fr/translation.json`:
```json
{
  "common": { "app_name": "Shrm Setu" },
  "home": { "title": "Écran d'accueil" },
  "language": { "select_language": "Sélectionner la langue" },
  // ... rest of translations
}
```

Create `locales/de/translation.json`:
```json
{
  "common": { "app_name": "Shrm Setu" },
  "home": { "title": "Startbildschirm" },
  "language": { "select_language": "Sprache auswählen" },
  // ... rest of translations
}
```

### Step 3: Update Configuration

Edit `config/i18n.js`:

```javascript
import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/translation.json';
import esTranslation from '../locales/es/translation.json';
import frTranslation from '../locales/fr/translation.json'; // ADD
import deTranslation from '../locales/de/translation.json'; // ADD

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'es', 'fr', 'de']; // UPDATE

export const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation }, // ADD
  de: { translation: deTranslation }, // ADD
};
```

### ✅ Done!

App now supports:
- 🇬🇧 English
- 🇮🇳 Hindi
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German

User sees 5 language buttons in switcher.

---

## Example 3: Adding Japanese (JA) - Full Walkthrough

### Scenario
Project is expanding to Japan. Need Japanese language support.

### Step 1: Create Folder

```bash
mkdir -p locales/ja
```

### Step 2: Create Translation File

Create `locales/ja/translation.json`:

```json
{
  "common": {
    "app_name": "シュルムセツ",
    "welcome": "ようこそ",
    "hello": "こんにちは"
  },
  "home": {
    "title": "ホームスクリーン",
    "welcome_message": "シュルムセツへようこそ",
    "subtitle": "素晴らしい機能の探索を始めましょう",
    "description": "これは翻訳可能なコンポーネントの例です"
  },
  "language": {
    "select_language": "言語を選択",
    "english": "English",
    "hindi": "हिंदी",
    "language_selected": "言語を日本語に変更しました"
  },
  "navigation": {
    "home": "ホーム",
    "explore": "探索",
    "back": "戻る"
  },
  "buttons": {
    "save": "保存",
    "cancel": "キャンセル",
    "continue": "続行",
    "next": "次へ",
    "previous": "前へ",
    "close": "閉じる"
  },
  "messages": {
    "loading": "読み込み中...",
    "error": "エラーが発生しました",
    "success": "成功",
    "no_data": "利用可能なデータがありません"
  }
}
```

### Step 3: Update Configuration

Edit `config/i18n.js`:

```javascript
// Add import at top
import jaTranslation from '../locales/ja/translation.json'; // ADD THIS

// Update supported languages
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'es', 'fr', 'de', 'ja']; // ADD 'ja'

// Update resources
export const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  de: { translation: deTranslation },
  ja: { translation: jaTranslation }, // ADD THIS BLOCK
};
```

### ✅ Done!

Japanese support is live:
- Language switcher shows Japanese option (日本語)
- All text translates when Japanese is selected
- No code changes needed elsewhere

---

## Quick Reference: Language Codes

| Language | Code | File Name |
|----------|------|-----------|
| English | `en` | `locales/en/translation.json` |
| Hindi | `hi` | `locales/hi/translation.json` |
| Spanish | `es` | `locales/es/translation.json` |
| French | `fr` | `locales/fr/translation.json` |
| German | `de` | `locales/de/translation.json` |
| Japanese | `ja` | `locales/ja/translation.json` |
| Chinese (Simplified) | `zh` | `locales/zh/translation.json` |
| Portuguese (Brazil) | `pt-BR` | `locales/pt-BR/translation.json` |
| Russian | `ru` | `locales/ru/translation.json` |
| Arabic | `ar` | `locales/ar/translation.json` |

---

## The 3-Step Pattern (Always the Same)

For ANY new language:

1. **Create Folder**
   ```bash
   mkdir -p locales/{LANG_CODE}
   ```

2. **Create Translation File**
   - Copy from `locales/en/translation.json`
   - Translate all values to the new language
   - Save to `locales/{LANG_CODE}/translation.json`

3. **Update Config**
   - Add import: `import {X}Translation from '../locales/{LANG_CODE}/translation.json'`
   - Add to SUPPORTED_LANGUAGES: `export const SUPPORTED_LANGUAGES = [..., '{LANG_CODE}']`
   - Add to resources: `{LANG_CODE}: { translation: {X}Translation }`

**That's it.** Components automatically show new language option.

---

## Checklist for Adding Language

- [ ] Created `locales/{lang_code}/` folder
- [ ] Created `translation.json` file with all translation keys
- [ ] Verified JSON syntax is valid (use JSONLint)
- [ ] Added import to `config/i18n.js`
- [ ] Added language code to `SUPPORTED_LANGUAGES` array
- [ ] Added language object to `resources`
- [ ] No syntax errors (JSON is strict)
- [ ] All keys match existing languages (no missing keys)
- [ ] Tested language switcher shows new language

---

## Common Translation Key Structure

When creating translation files, always include these base keys:

```json
{
  "common": {
    "app_name": "",
    "welcome": "",
    "hello": "",
    "yes": "",
    "no": ""
  },
  "home": {
    "title": "",
    "welcome_message": "",
    "subtitle": "",
    "description": ""
  },
  "language": {
    "select_language": "",
    "language_selected": ""
  },
  "navigation": {
    "home": "",
    "explore": "",
    "back": "",
    "next": "",
    "previous": ""
  },
  "buttons": {
    "save": "",
    "cancel": "",
    "delete": "",
    "close": "",
    "continue": ""
  },
  "messages": {
    "loading": "",
    "error": "",
    "success": "",
    "no_data": ""
  }
}
```

---

## Validation

### Check if Language is Supported

```javascript
import { SUPPORTED_LANGUAGES } from '@/config/i18n';

if (SUPPORTED_LANGUAGES.includes('es')) {
  console.log('Spanish is supported');
} else {
  console.log('Spanish not supported');
}
```

### Verify All Keys in Translation

```javascript
// In config/i18n.js
// Ensure all languages have the same key structure
console.log('EN keys:', Object.keys(enTranslation));
console.log('HI keys:', Object.keys(hiTranslation));
console.log('ES keys:', Object.keys(esTranslation));
// All should match
```

---

## Performance

Adding languages is:
- **Fast**: Just JSON files + 3 lines of code changes
- **Memory-efficient**: All translation files are bundled at build time
- **No runtime impact**: Language switching is instant
- **Scalable**: Can handle 50+ languages without slowdown

---

## Real-World Workflow

### Day 1: Add Spanish
1. Translator creates `locales/es/translation.json`
2. Developer updates `config/i18n.js`
3. App now supports Spanish (5 minutes)

### Week 1: Add French & German
1. Translators create `locales/fr/translation.json` and `locales/de/translation.json`
2. Developer updates `config/i18n.js` (2 lines each)
3. App now supports 5 languages (10 minutes)

### Month 3: Add 5 More Languages
- Repeat the pattern
- Takes ~30 minutes for all configuration

**No app redesign. No breaking changes. Just translations.**

---

## Summary

The i18n system is designed to be infinitely scalable:

- ✅ Start with 2 languages (English, Hindi)
- ✅ Scale to 5+ languages without code changes
- ✅ Add 50+ languages if needed
- ✅ Each language adds minimal bundle size (~5-10KB per language)
- ✅ Zero performance impact
- ✅ Instant language switching

**The system grows with your product.**
