import { Stack } from 'expo-router';
import Dashboard from '../../shrmSetuUi/worker/deshBoard';

export default function DashboardScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <Dashboard />
    </>
  );
}
