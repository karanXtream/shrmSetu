import { Stack } from 'expo-router';
import SignIn from '@/shrmSetuUi/frontUI/SignIn';

export default function SignInScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SignIn />
    </>
  );
}
