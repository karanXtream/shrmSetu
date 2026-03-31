import { StyleSheet, View } from 'react-native';
import Dashboard from '@/shrmSetuUi/worker/deshBoard';

export default function Home() {
  return (
    <View style={styles.container}>
      <Dashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
