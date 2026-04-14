import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack initialRouteName="sign-in">
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false }}
      />
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
      <Stack.Screen 
        name="post" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="worker-profile" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="chat-detail" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="chats" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="search" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}
