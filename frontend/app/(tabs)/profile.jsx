import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/use-translation';
import { useState } from 'react';
import WorkerProfile from '@/shrmSetuUi/worker/profile';

export default function ProfileScreen() {
  const t = useTranslation();
  const [showEditProfile, setShowEditProfile] = useState(false);

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

        {/* PROFILE INFO */}
        <View style={styles.section}>
          {/* PROFILE AVATAR */}
          <View style={styles.profileCard}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf3-wFxMY7RJAO0X3oazyFD0oobOh8ADYCZAOT2zqsmZEfZPvxlcO68y8zh7Y6RkLfVWS8tb6NcITV1j0RcI2NhjM-XFSdD_NWqz5cntJYM_htV_vw6p5NoUO2RlrlhOG8XK8p5vRhSFc2srduAmWsB0MXTUm8T17uFwC_BCJkpFUOQ8TgE_OGEra2xKsUee2GFkzgHT_ZGogESVrbcXXC0BhJZFg2XXC-Pw_i35MdfC5k0li8NrMooxR_x19Z_5NR0FMBg4LuxWm9',
              }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Alex Johnson</Text>
              <Text style={styles.role}>Professional Worker</Text>
            </View>
          </View>

          {/* MENU OPTIONS */}
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

            <TouchableOpacity style={styles.menuItem}>
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

  profileCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  role: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
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
