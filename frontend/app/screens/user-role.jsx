import { Stack } from 'expo-router';
import UserRole from '@/shrmSetuUi/frontUI/UserRole';

export default function UserRoleScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: '',
          headerBackTitle: '',
        }} 
      />
      <UserRole />
    </>
  );
}
