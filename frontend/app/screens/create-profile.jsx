import { Stack } from 'expo-router';
import CreateProfile from '../../shrmSetuUi/frontUI/createProfile';

export default function CreateProfileScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <CreateProfile />
    </>
  );
}
