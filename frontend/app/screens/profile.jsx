import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      router.push('screens/user-hire');
    } else if (tab === 'search') {
      router.push('screens/search');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#003f87" />
            </View>
            <Text style={styles.userName}>User Name</Text>
            <Text style={styles.userEmail}>user@email.com</Text>
          </View>

          {/* Profile Menu Items */}
          <View style={styles.menuSection}>
            <ProfileMenuItem icon="person" label="Edit Profile" />
            <ProfileMenuItem icon="briefcase" label="My Applications" />
            <ProfileMenuItem icon="bookmark" label="Saved Jobs" />
            <ProfileMenuItem icon="settings" label="Settings" />
            <ProfileMenuItem icon="help-circle" label="Help & Support" />
            <ProfileMenuItem icon="log-out" label="Logout" isLogout={true} />
          </View>
        </ScrollView>

        {/* BOTTOM TABS */}
        <View style={styles.nav}>
          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('home')}>
            <Ionicons name="home" size={24} color="#999" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('search')}>
            <Ionicons name="search" size={24} color="#999" />
            <Text style={styles.navLabel}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('profile')}>
            <Ionicons name="person" size={24} color="#003f87" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

function ProfileMenuItem({ icon, label, isLogout }) {
  return (
    <TouchableOpacity style={[styles.menuItem, isLogout && styles.logoutItem]}>
      <Ionicons name={icon} size={20} color={isLogout ? '#d32f2f' : '#003f87'} />
      <Text style={[styles.menuLabel, isLogout && styles.logoutLabel]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={isLogout ? '#d32f2f' : '#999'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingBottom: 60,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  menuSection: {
    marginTop: 16,
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoutItem: {
    marginTop: 16,
    borderBottomWidth: 0,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    marginLeft: 16,
    fontWeight: '500',
  },
  logoutLabel: {
    color: '#d32f2f',
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
