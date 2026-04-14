import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { LanguageProvider } from '@/context/LanguageContext';
import { initializeI18n } from '@/config/i18n';
import i18n from '@/config/i18n';
import { RootProvider } from '@/providers/RootProvider';

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animationEnabled: true,
          headerShown: false,
        }}
        initialRouteName="splash"
      >
        {/* Splash/Home Screen - First Screen */}
        <Stack.Screen 
          name="splash" 
          options={{ 
            headerShown: false,
            animationEnabled: false,
          }} 
        />
        {/* Onboarding screens - NO TABS - starts here */}
        <Stack.Screen 
          name="screens" 
          options={{ 
            headerShown: false,
            animationEnabled: false,
          }} 
        />
        {/* Main app screens - WITH TABS */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animationEnabled: true,
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);
  const [initialLanguage, setInitialLanguage] = useState('en');

  // Initialize i18next on app startup and detect user role
  useEffect(() => {
    const setupI18n = async () => {
      try {
        // Get user data from AsyncStorage to check their role
        const userData = await AsyncStorage.getItem('userData');
        let defaultLanguage = 'en';

        if (userData) {
          try {
            const parsedUserData = JSON.parse(userData);
            // If user is a worker, set default language to Hindi
            if (parsedUserData.role === 'worker') {
              defaultLanguage = 'hi';
            }
          } catch (parseError) {
            console.error('Failed to parse user data:', parseError);
          }
        }

        setInitialLanguage(defaultLanguage);
        await initializeI18n(defaultLanguage);
        setI18nReady(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setI18nReady(true); // Still render, fallback to default
      }
    };

    setupI18n();
  }, []);

  if (!i18nReady) {
    return null; // Or show a loading screen
  }

  return (
    <RootProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <RootLayoutNav />
        </LanguageProvider>
      </I18nextProvider>
    </RootProvider>
  );
}
