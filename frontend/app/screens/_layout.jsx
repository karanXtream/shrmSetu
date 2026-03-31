import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="language-selection" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="user-role" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="create-profile" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="dashboard" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}
