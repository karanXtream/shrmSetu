import { Stack } from 'expo-router';
import UserFlow from '../../shrmSetuUi/userUi/User';

export default function UserHireScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <UserFlow />
    </>
  );
}
