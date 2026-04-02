import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SearchScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('search');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      router.push('screens/user-hire');
    } else if (tab === 'profile') {
      router.push('screens/profile');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="search" size={64} color="#ccc" />
          <Text style={styles.title}>Search Jobs</Text>
          <Text style={styles.subtitle}>Search functionality coming soon</Text>
        </View>

        {/* BOTTOM TABS */}
        <View style={styles.nav}>
          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('home')}>
            <Ionicons name="home" size={24} color="#999" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('search')}>
            <Ionicons name="search" size={24} color="#003f87" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('profile')}>
            <Ionicons name="person" size={24} color="#999" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItemContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#003f87',
    fontWeight: 'bold',
  },
});
