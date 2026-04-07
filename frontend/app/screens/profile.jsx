import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/RootProvider';

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color="#003f87" />
      <View style={styles.detailTextWrap}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || '-'}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
  });

  useEffect(() => {
    setForm({
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      email: user?.email || '',
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      pincode: user?.location?.pincode || '',
      addressLine1: user?.location?.addressLine1 || '',
      addressLine2: user?.location?.addressLine2 || '',
    });
  }, [user]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      router.replace('/screens/user-hire');
    } else if (tab === 'post') {
      router.replace('/screens/post');
    } else if (tab === 'search') {
      router.replace('/screens/search');
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    const mergedUser = {
      ...(user || {}),
      fullName: form.fullName,
      phoneNumber: form.phoneNumber,
      email: form.email,
      location: {
        ...(user?.location || {}),
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
      },
    };

    await updateUser(mergedUser);
    setSaveMessage('Profile updated successfully');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/screens/sign-in');
  };

  const profilePhotoUri =
    user?.workerProfile?.media?.profilePhoto ||
    user?.media?.profilePhoto ||
    user?.profilePhoto ||
    null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              {profilePhotoUri ? (
                <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={48} color="#003f87" />
              )}
            </View>
            <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'No email available'}</Text>
          </View>

          {saveMessage ? <Text style={styles.saveMessage}>{saveMessage}</Text> : null}

          {isEditing ? (
            <View style={styles.editSection}>
              <Text style={styles.editTitle}>Edit Profile</Text>

              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput style={styles.input} value={form.fullName} onChangeText={(text) => handleChange('fullName', text)} />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput style={styles.input} value={form.phoneNumber} keyboardType="phone-pad" onChangeText={(text) => handleChange('phoneNumber', text)} />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} value={form.email} keyboardType="email-address" autoCapitalize="none" onChangeText={(text) => handleChange('email', text)} />

              <Text style={styles.inputLabel}>City</Text>
              <TextInput style={styles.input} value={form.city} onChangeText={(text) => handleChange('city', text)} />

              <Text style={styles.inputLabel}>State</Text>
              <TextInput style={styles.input} value={form.state} onChangeText={(text) => handleChange('state', text)} />

              <Text style={styles.inputLabel}>Pincode</Text>
              <TextInput style={styles.input} value={form.pincode} keyboardType="numeric" onChangeText={(text) => handleChange('pincode', text)} />

              <Text style={styles.inputLabel}>Address Line 1</Text>
              <TextInput style={styles.input} value={form.addressLine1} onChangeText={(text) => handleChange('addressLine1', text)} />

              <Text style={styles.inputLabel}>Address Line 2</Text>
              <TextInput style={styles.input} value={form.addressLine2} onChangeText={(text) => handleChange('addressLine2', text)} />

              <View style={styles.editButtonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.detailsSection}>
              <DetailRow icon="person-outline" label="Full Name" value={user?.fullName} />
              <DetailRow icon="call-outline" label="Phone" value={user?.phoneNumber} />
              <DetailRow icon="mail-outline" label="Email" value={user?.email} />
              <DetailRow icon="business-outline" label="City" value={user?.location?.city} />
              <DetailRow icon="navigate-outline" label="State" value={user?.location?.state} />
              <DetailRow icon="location-outline" label="Pincode" value={user?.location?.pincode} />
              <DetailRow icon="home-outline" label="Address Line 1" value={user?.location?.addressLine1} />
              <DetailRow icon="home-outline" label="Address Line 2" value={user?.location?.addressLine2} />

              <TouchableOpacity style={styles.menuItem} onPress={() => setIsEditing(true)}>
                <Ionicons name="create-outline" size={20} color="#003f87" />
                <Text style={styles.menuLabel}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
                <Text style={[styles.menuLabel, styles.logoutLabel]}>Logout</Text>
                <Ionicons name="chevron-forward" size={20} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 88 }} />
        </ScrollView>

        <View style={styles.nav}>
          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('home')}>
            <Ionicons name="home" size={24} color="#999" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('post')}>
            <Ionicons name="add-circle" size={24} color="#999" />
            <Text style={styles.navLabel}>Post</Text>
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
    paddingVertical: 28,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  saveMessage: {
    marginTop: 12,
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    fontSize: 13,
    fontWeight: '600',
  },
  detailsSection: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  detailTextWrap: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  detailValue: {
    marginTop: 2,
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  editSection: {
    marginTop: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  inputLabel: {
    marginTop: 8,
    marginBottom: 6,
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#dbe3ef',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  editButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#003f87',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  logoutItem: {
    marginTop: 2,
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
