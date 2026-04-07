import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Switch, Alert, Animated, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as postService from '../../services/postService';

const AVAILABLE_SKILLS = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mason', 'Welder', 'Mechanic', 'Gardener', 'Cleaner', 'Handyman'];
const INDIAN_STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

export default function PostForm() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [address, setAddress] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [price, setPrice] = useState('');
  const [stayAvailable, setStayAvailable] = useState(false);
  const [foodAvailable, setFoodAvailable] = useState(false);
  const [workPhotos, setWorkPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Animate checkmark when success modal shows
  useEffect(() => {
    if (showSuccessModal) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [showSuccessModal, scaleAnim]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultiple: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map(asset => asset.uri);
      setWorkPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index) => {
    setWorkPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSkill = (skill) => {
    setRequiredSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (!customSkillInput.trim()) {
      Alert.alert('Validation', 'Please enter a skill');
      return;
    }
    
    const trimmedSkill = customSkillInput.trim();
    if (requiredSkills.includes(trimmedSkill)) {
      Alert.alert('Validation', 'This skill has already been added');
      return;
    }
    
    setRequiredSkills(prev => [...prev, trimmedSkill]);
    setCustomSkillInput('');
  };

  const removeCustomSkill = (skill) => {
    const isCustom = !AVAILABLE_SKILLS.includes(skill);
    if (isCustom) {
      setRequiredSkills(prev => prev.filter(s => s !== skill));
    }
  };

  const resetFormAndCloseModal = () => {
    // Reset form
    setCity('');
    setState('');
    setPin('');
    setAddress('');
    setRequiredSkills([]);
    setCustomSkillInput('');
    setPrice('');
    setStayAvailable(false);
    setFoodAvailable(false);
    setWorkPhotos([]);
    
    // Close modal
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!city.trim()) {
      Alert.alert('Validation', 'City is required');
      return;
    }

    if (!state.trim()) {
      Alert.alert('Validation', 'State is required');
      return;
    }

    if (!pin.trim() || pin.length !== 6) {
      Alert.alert('Validation', 'PIN code must be 6 digits');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Validation', 'Address is required');
      return;
    }

    if (requiredSkills.length === 0) {
      Alert.alert('Validation', 'Please select at least one required skill');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Validation', 'Price is required');
      return;
    }

    if (workPhotos.length === 0) {
      Alert.alert('Validation', 'Please upload at least one work photo');
      return;
    }

    try {
      setIsLoading(true);

      const postData = {
        city: city.trim(),
        state: state.trim(),
        pin: pin.trim(),
        address: address.trim(),
        requiredSkills,
        expectedPrice: parseFloat(price),
        stayAvailable,
        foodAvailable,
        workPhotos,
      };

      console.log('Submitting post with data:', postData);

      const response = await postService.createPost(postData);

      console.log('Post created successfully:', response);

      // Show success modal with post details
      setSuccessData({
        postId: response.data?._id || response._id,
        city: response.data?.city || city,
        state: response.data?.state || state,
        skills: response.data?.requiredSkills || requiredSkills,
        price: response.data?.expectedPrice || price,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating post:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create post. Please try again.';

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.formSection}>
        {/* LOCATION FIELDS */}
        <View style={styles.fieldWrapper}>
          <View style={styles.labelRow}>
            <Ionicons name="location-outline" size={18} color="#003f87" />
            <Text style={styles.label}>Work Location</Text>
            <Text style={styles.required}>*</Text>
          </View>

          {/* CITY AND STATE ROW */}
          <View style={styles.locationRowWrapper}>
            <View style={styles.locationFieldHalf}>
              <Text style={styles.locationLabel}>City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Enter city"
                style={styles.locationInput}
                placeholderTextColor="#cbd5e1"
              />
            </View>
            <View style={styles.locationFieldHalf}>
              <Text style={styles.locationLabel}>State</Text>
              <TextInput
                value={state}
                onChangeText={setState}
                placeholder="Enter state"
                style={styles.locationInput}
                placeholderTextColor="#cbd5e1"
              />
            </View>
          </View>

          {/* PIN FIELD */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.locationLabel}>PIN Code</Text>
            <TextInput
              value={pin}
              onChangeText={(text) => {
                if (/^\d{0,6}$/.test(text)) {
                  setPin(text);
                }
              }}
              placeholder="6 digit PIN"
              style={styles.locationInput}
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#cbd5e1"
            />
          </View>

          {/* ADDRESS FIELD */}
          <View>
            <Text style={styles.locationLabel}>Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter complete address or landmarks"
              style={[styles.locationInput, { minHeight: 80 }]}
              placeholderTextColor="#cbd5e1"
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* REQUIRED SKILLS FIELD */}
        <View style={styles.fieldWrapper}>
          <View style={styles.labelRow}>
            <Ionicons name="briefcase-outline" size={18} color="#003f87" />
            <Text style={styles.label}>Skills Needed</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <View style={styles.skillsContainer}>
            {AVAILABLE_SKILLS.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.skillChip,
                  requiredSkills.includes(skill) && styles.skillChipActive
                ]}
                onPress={() => toggleSkill(skill)}
              >
                <Text
                  style={[
                    styles.skillChipText,
                    requiredSkills.includes(skill) && styles.skillChipTextActive
                  ]}
                >
                  {skill}
                </Text>
                {requiredSkills.includes(skill) && (
                  <Ionicons name="checkmark" size={14} color="#fff" style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* CUSTOM SKILL INPUT */}
          <View style={styles.customSkillInputWrapper}>
            <TextInput
              value={customSkillInput}
              onChangeText={setCustomSkillInput}
              placeholder="Enter custom skill"
              style={styles.customSkillInput}
              placeholderTextColor="#cbd5e1"
              onSubmitEditing={addCustomSkill}
            />
            <TouchableOpacity style={styles.addSkillBtn} onPress={addCustomSkill}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* CUSTOM SKILLS DISPLAY */}
          {requiredSkills.filter(s => !AVAILABLE_SKILLS.includes(s)).length > 0 && (
            <View style={styles.customSkillsContainer}>
              {requiredSkills
                .filter(s => !AVAILABLE_SKILLS.includes(s))
                .map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={styles.customSkillTag}
                    onLongPress={() => removeCustomSkill(skill)}
                  >
                    <Text style={styles.customSkillTagText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeCustomSkill(skill)}>
                      <Ionicons name="close" size={12} color="#fff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

        {/* PRICE FIELD */}
        <View style={styles.fieldWrapper}>
          <View style={styles.labelRow}>
            <Ionicons name="cash-outline" size={18} color="#003f87" />
            <Text style={styles.label}>Expected Price</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <View style={styles.priceInputWrapper}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="0"
              keyboardType="decimal-pad"
              style={styles.priceInput}
              placeholderTextColor="#cbd5e1"
            />
          </View>
        </View>

        {/* TOGGLE FIELDS */}
        <View style={styles.featureRow}>
          <View style={[styles.featureBox, stayAvailable && styles.featureBoxActive]}>
            <View style={styles.featureHeader}>
              <Ionicons name="bed-outline" size={18} color={stayAvailable ? '#fff' : '#003f87'} />
              <Text style={[styles.featureLabel, stayAvailable && styles.featureLabelActive]}>
                Stay
              </Text>
            </View>
            <Switch
              value={stayAvailable}
              onValueChange={setStayAvailable}
              trackColor={{ false: '#d1d5db', true: '#0066ff' }}
              thumbColor={stayAvailable ? '#fff' : '#e5e7eb'}
            />
          </View>

          <View style={[styles.featureBox, foodAvailable && styles.featureBoxActive]}>
            <View style={styles.featureHeader}>
              <Ionicons name="restaurant-outline" size={18} color={foodAvailable ? '#fff' : '#003f87'} />
              <Text style={[styles.featureLabel, foodAvailable && styles.featureLabelActive]}>
                Food
              </Text>
            </View>
            <Switch
              value={foodAvailable}
              onValueChange={setFoodAvailable}
              trackColor={{ false: '#d1d5db', true: '#0066ff' }}
              thumbColor={foodAvailable ? '#fff' : '#e5e7eb'}
            />
          </View>
        </View>

        {/* PHOTO UPLOAD */}
        <View style={styles.fieldWrapper}>
          <View style={styles.labelRow}>
            <Ionicons name="image-outline" size={18} color="#003f87" />
            <Text style={styles.label}>Work Photos</Text>
            <Text style={styles.required}>*</Text>
            {workPhotos.length > 0 && (
              <Text style={styles.photoCount}>({workPhotos.length})</Text>
            )}
          </View>

          <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
            <View style={styles.photoPickerInner}>
              <Ionicons name="cloud-upload-outline" size={32} color="#003f87" />
              <Text style={styles.photoPickerText}>
                {workPhotos.length === 0 ? 'Upload Photos' : 'Add More Photos'}
              </Text>
              <Text style={styles.photoPickerSubtext}>
                {workPhotos.length === 0 ? 'Add work photos' : 'Tap to add more'}
              </Text>
            </View>
          </TouchableOpacity>

          {workPhotos.length > 0 && (
            <View style={styles.photoGrid}>
              {workPhotos.map((photo, index) => (
                <View key={index} style={styles.photoThumbnail}>
                  <Image source={{ uri: photo }} style={styles.thumbnailImage} />
                  <TouchableOpacity
                    style={styles.removePhotoIcon}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close" size={14} color="#fff" />
                  </TouchableOpacity>
                  <View style={styles.photoNumber}>
                    <Text style={styles.photoNumberText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* SUBMIT BUTTON */}
      <LinearGradient
        colors={['#003f87', '#0055c4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.submitBtnGradient, isLoading && { opacity: 0.7 }]}
      >
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.submitText}>Post Job</Text>
            </>
          )}
        </TouchableOpacity>
      </LinearGradient>

      {/* SUCCESS MODAL */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => resetFormAndCloseModal()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            {/* Animated Checkmark */}
            <Animated.View
              style={[
                styles.checkmarkContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.checkmarkCircle}>
                <Ionicons name="checkmark" size={60} color="#fff" />
              </View>
            </Animated.View>

            {/* Success Message */}
            <Text style={styles.successTitle}>Post Created Successfully!</Text>
            <Text style={styles.successSubtitle}>Your job posting is now live</Text>

            {/* Post Details */}
            {successData && (
              <View style={styles.postDetailsBox}>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={16} color="#003f87" />
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{successData.city}, {successData.state}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="briefcase" size={16} color="#003f87" />
                  <Text style={styles.detailLabel}>Skills:</Text>
                  <Text style={styles.detailValue}>{successData.skills?.join(', ')}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="cash" size={16} color="#003f87" />
                  <Text style={styles.detailLabel}>Budget:</Text>
                  <Text style={styles.detailValue}>₹{successData.price}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="document-text" size={16} color="#003f87" />
                  <Text style={styles.detailLabel}>Post ID:</Text>
                  <Text style={styles.detailId}>{successData.postId?.slice(-8)}</Text>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => resetFormAndCloseModal()}
              >
                <Ionicons name="add-circle" size={18} color="#fff" />
                <Text style={styles.primaryButtonText}>Post Another Job</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => resetFormAndCloseModal()}
              >
                <Ionicons name="close" size={18} color="#003f87" />
                <Text style={styles.secondaryButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#003f87',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  formSection: {
    marginBottom: 16,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  required: {
    color: '#ef4444',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#d7e7ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f0f6ff',
    fontFamily: 'System',
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d7e7ff',
    borderRadius: 12,
    backgroundColor: '#f0f6ff',
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003f87',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  featureBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  featureBoxActive: {
    backgroundColor: '#003f87',
    borderColor: '#003f87',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003f87',
  },
  featureLabelActive: {
    color: '#fff',
  },
  photoPicker: {
    borderWidth: 2,
    borderColor: '#003f87',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
  },
  photoPickerInner: {
    alignItems: 'center',
    gap: 6,
  },
  photoPickerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#003f87',
  },
  photoPickerSubtext: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  photoCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066ff',
    marginLeft: 4,
  },
  photoGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoThumbnail: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  photoNumber: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: '#003f87',
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  submitBtnGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#d7e7ff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillChipActive: {
    backgroundColor: '#003f87',
    borderColor: '#003f87',
  },
  skillChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003f87',
  },
  skillChipTextActive: {
    color: '#fff',
  },
  customSkillInputWrapper: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  customSkillInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#d7e7ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f0f6ff',
  },
  addSkillBtn: {
    backgroundColor: '#003f87',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  customSkillTag: {
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customSkillTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  locationRowWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  locationFieldHalf: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  locationInput: {
    borderWidth: 1.5,
    borderColor: '#d7e7ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f0f6ff',
    fontFamily: 'System',
  },
  // SUCCESS MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  postDetailsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 16,
    paddingHorizontal: 14,
    width: '100%',
    marginBottom: 28,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    width: 60,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  detailId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003f87',
    backgroundColor: '#f0f6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontFamily: 'Courier New',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    color: '#003f87',
    fontSize: 15,
    fontWeight: '700',
  },
});
