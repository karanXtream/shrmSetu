import { Stack } from 'expo-router';
import LanguageSelection from '@/shrmSetuUi/frontUI/languageSelection';

export default function LanguageSelectionScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: '',
          headerBackTitle: '',
        }} 
      />
      <LanguageSelection />
    </>
  );
}


