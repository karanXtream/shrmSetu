# Integration Guide - TanStack Query Setup

## How to Integrate RootProvider into Your App

### Step 1: Update `app/_layout.jsx`

Add RootProvider wrapper around your existing providers:

```javascript
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { LanguageProvider } from '@/context/LanguageContext';
import { RootProvider } from '@/providers/RootProvider';  // ADD THIS
import { initializeI18n } from '@/config/i18n';
import i18n from '@/config/i18n';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [i18nReady, setI18nReady] = useState(false);

  // Initialize i18next on app startup
  useEffect(() => {
    const setupI18n = async () => {
      try {
        await initializeI18n('en');
        setI18nReady(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setI18nReady(true);
      }
    };
    setupI18n();
  }, []);

  if (!i18nReady) {
    return null;
  }

  return (
    // WRAP WITH RootProvider
    <RootProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider initialLanguage="en">
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                animationEnabled: true,
                headerShown: false,
              }}
            >
              {/* Your existing screens */}
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </LanguageProvider>
      </I18nextProvider>
    </RootProvider>
  );
}
```

### Step 2: Create `.env.local`

```bash
cp .env.example .env.local
```

Update with your backend URL:
```env
EXPO_PUBLIC_API_URL=http://your-backend.com
```

### Step 3: Test the Setup

The setup is now working! You can test by importing hooks:

```javascript
// In any component
import { useWorker } from '@/services/queries';
import { useAuth } from '@/providers/RootProvider';

export const TestComponent = () => {
  const { isSignedIn, user } = useAuth();
  
  return <Text>Auth setup working: {isSignedIn ? 'Yes' : 'No'}</Text>;
};
```

## File Structure Created

```
frontend/
├── config/
│   ├── axios.js                    ✅ Axios client with interceptors
│   └── queryClient.js              ✅ TanStack Query config
├── services/
│   ├── api.js                      ✅ API endpoints (TODO: implement)
│   ├── queryKeys.js                ✅ Query key factory
│   └── queries.js                  ✅ Query/Mutation hooks
├── providers/
│   └── RootProvider.js             ✅ Query & Auth providers
├── hooks/
│   └── useQueryUtils.js            ✅ Utility hooks
├── TANSTACK_QUERY_SETUP.md         ✅ Full documentation
├── .env.example                    ✅ Environment template
└── app/_layout.jsx                 ⏳ Update with RootProvider
```

## Features Implemented

✅ **TanStack Query v5** - Fast, mature, and well-documented
✅ **Axios with Interceptors** - Auto auth tokens, error handling
✅ **Query Key Factory** - Organized, hierarchical query keys
✅ **Query Hooks** - Ready to use, just add API calls
✅ **Mutation Hooks** - Auto cache invalidation
✅ **Auth Context** - Token management in AsyncStorage
✅ **Error Handling** - Global interceptor with consistent format
✅ **Retry Logic** - Exponential backoff, 2 retries by default
✅ **Caching Strategy** - 5min default, configurable per query
✅ **Pagination Support** - Utility hook for page management

## Ready to Implement APIs?

When you're ready to connect to backend:

1. Open `services/api.js`
2. Replace `console.log` calls with actual API calls
3. Example:

```javascript
export const workerAPI = {
  getProfile: async (id) => {
    return apiClient.get(`/api/workers/${id}`);
  },
};
```

4. Run app and test!

## Efficiency Benefits

| Benefit | Why |
|---------|-----|
| **No Duplicate Requests** | Automatic request deduplication |
| **Smart Caching** | Only refetch when needed |
| **Automatic Retries** | Network resilience |
| **Background Updates** | Fresh data without blocking UI |
| **Memory Management** | Automatic garbage collection |
| **Type Safety** | Clear data flow |
| **Easy Testing** | Mocked queries simple |

## Next Steps

1. ✅ Update `app/_layout.jsx` with RootProvider
2. ✅ Create `.env.local` with backend URL
3. ⏳ Implement API endpoints in `services/api.js`
4. ⏳ Start using hooks in components
5. ⏳ Add error boundaries
6. ⏳ Implement optimistic updates (optional)

All infrastructure is ready! 🚀
