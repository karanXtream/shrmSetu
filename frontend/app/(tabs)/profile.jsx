import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/use-translation';
import { useState, useEffect } from 'react';
import WorkerProfile from '@/shrmSetuUi/worker/profile';
import { useAuth } from '@/providers/RootProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const t = useTranslation();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileName, setProfileName] = useState('Profile');
  const [profilePhotos, setProfilePhotos] = useState('https://via.placeholder.com/100');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Try to get user name from auth context
        if (user?.fullName) {
          setProfileName(user.fullName);
        } else {
          // Fallback to AsyncStorage
          const userJson = await AsyncStorage.getItem('userData');
          if (userJson) {
            const userData = JSON.parse(userJson);
            setProfileName(userData.fullName || userData.name || 'Profile');
            if (userData.profilePhoto) {
              setProfilePhotos(userData.profilePhoto);
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadUserData();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await logout();
              // Navigate back to sign-in screen using expo-router
              router.replace('/screens/sign-in');
            } catch (err) {
              Alert.alert("Error", "Failed to logout. Please try again.");
              console.error("Logout error:", err);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (showEditProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.editProfileHeader}>
          <TouchableOpacity onPress={() => setShowEditProfile(false)}>
            <Ionicons name="arrow-back" size={24} color="#003f87" />
          </TouchableOpacity>
          <Text style={styles.editProfileTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <WorkerProfile />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.appName}>{t('common.app_name')}</Text>
        </View>

        {/* MENU OPTIONS */}
        <View style={styles.section}>
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowEditProfile(true)}>
              <View style={styles.menuIcon}>
                <Ionicons name="person-outline" size={20} color="#003f87" />
              </View>
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Ionicons name="settings-outline" size={20} color="#003f87" />
              </View>
              <Text style={styles.menuText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Ionicons name="help-circle-outline" size={20} color="#003f87" />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuIcon}>
                <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
              </View>
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 44,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },

  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003f87',
  },

  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  menuSection: {
    marginTop: 20,
  },

  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  logoutText: {
    color: '#d32f2f',
  },

  editProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 44,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },

  editProfileTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003f87',
  },
});
