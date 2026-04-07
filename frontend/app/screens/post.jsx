import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import PostForm from '@/shrmSetuUi/formDetails/PostForm';

export default function PostScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('post');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      router.replace('/screens/user-hire');
    } else if (tab === 'search') {
      router.replace('/screens/search');
    } else if (tab === 'profile') {
      router.replace('/screens/profile');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Post</Text>
            <Text style={styles.headerSubtitle}>Share your requirement for workers</Text>
          </View>

          <View style={styles.section}>
            <PostForm />
          </View>
        </ScrollView>

        <View style={styles.nav}>
          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('home')}>
            <Ionicons name="home" size={24} color="#999" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('post')}>
            <Ionicons name="add-circle" size={24} color="#003f87" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Post</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('search')}>
            <Ionicons name="search" size={24} color="#999" />
            <Text style={styles.navLabel}>Search</Text>
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingHorizontal: 16,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItemContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
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
