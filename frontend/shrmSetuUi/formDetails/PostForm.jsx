import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function PostForm() {
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [stayAvailable, setStayAvailable] = useState(false);
  const [foodAvailable, setFoodAvailable] = useState(false);
  const [workPhoto, setWorkPhoto] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setWorkPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!address.trim()) {
      Alert.alert('Validation', 'Address is required');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Validation', 'Price is required');
      return;
    }

    if (!workPhoto) {
      Alert.alert('Validation', 'Please upload a work photo');
      return;
    }

    Alert.alert('Success', 'Post details saved. API integration can be added next.');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Create Work Post</Text>

      <Text style={styles.label}>Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter work location"
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter expected price"
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.label}>Stay Available</Text>
          <Text style={styles.helper}>{stayAvailable ? 'Yes' : 'No'}</Text>
        </View>
        <Switch
          value={stayAvailable}
          onValueChange={setStayAvailable}
          trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
          thumbColor={stayAvailable ? '#003f87' : '#f4f4f5'}
        />
      </View>

      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.label}>Food Available</Text>
          <Text style={styles.helper}>{foodAvailable ? 'Yes' : 'No'}</Text>
        </View>
        <Switch
          value={foodAvailable}
          onValueChange={setFoodAvailable}
          trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
          thumbColor={foodAvailable ? '#003f87' : '#f4f4f5'}
        />
      </View>

      <Text style={styles.label}>Work Photo</Text>
      <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
        <Ionicons name="image-outline" size={20} color="#003f87" />
        <Text style={styles.photoPickerText}>{workPhoto ? 'Change Photo' : 'Upload Photo'}</Text>
      </TouchableOpacity>

      {workPhoto ? <Image source={{ uri: workPhoto }} style={styles.previewImage} /> : null}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  helper: {
    fontSize: 12,
    color: '#6b7280',
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
  toggleRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  photoPicker: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#f8fafc',
  },
  photoPickerText: {
    fontSize: 14,
    color: '#003f87',
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 12,
  },
  submitBtn: {
    marginTop: 16,
    backgroundColor: '#003f87',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
