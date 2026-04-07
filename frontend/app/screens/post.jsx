import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
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
          {/* GRADIENT HEADER */}
          <LinearGradient
            colors={['#003f87', '#0055c4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="add-circle" size={48} color="#fff" />
              </View>
              <Text style={styles.headerTitle}>Post a Job</Text>
              <Text style={styles.headerSubtitle}>Find workers to get your work done</Text>
            </View>
          </LinearGradient>

          {/* INFO CARD */}
          <View style={styles.infoCard}>
            <View style={styles.infoBadge}>
              <Ionicons name="spark" size={16} color="#fff" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Get Quick Responses</Text>
              <Text style={styles.infoText}>
                Detailed posts attract more qualified workers
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>

          <View style={styles.section}>
            <PostForm />
          </View>
        </ScrollView>

        {/* BOTTOM NAVIGATION */}
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
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 28,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cce7ff',
    fontWeight: '500',
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  infoBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#003f87',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003f87',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
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
