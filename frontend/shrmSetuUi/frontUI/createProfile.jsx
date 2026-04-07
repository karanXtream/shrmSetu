import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { LanguageContext } from "../../context/LanguageContext";
import BasicDetails from "../formDetails/BasicDetails";
import { useRegister } from "../../hooks/useAuthMutations";

export default function CreateProfile() {
  const { t } = useI18nextTranslation();
  const { language } = useContext(LanguageContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedRole = params?.role;

  // TanStack Query mutation for registration
  const registerMutation = useRegister();

  const isWorker = selectedRole === "work";
  const maxSteps = isWorker ? 6 : 4;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [form, setForm] = useState({
    profilePhoto: null,
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pin: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Worker-specific fields
    skills: [],
    education: "",
    yearsOfExperience: "",
    shopPhotos: [],
    introductoryVideo: null,
  });

  const educationOptions = [
    { label: t('createProfile.selectEducation'), value: "" },
    { label: t('createProfile.graduateAndAbove'), value: "graduate_above" },
    { label: t('createProfile.diplomaITI'), value: "diploma_iti" },
    { label: t('createProfile.twelfthPass'), value: "12th_pass" },
    { label: t('createProfile.tenthPass'), value: "10th_pass" },
    { label: t('createProfile.fifthPass'), value: "5th_pass" },
    { label: t('createProfile.noFormalEducation'), value: "no_education" },
  ];

  const experienceOptions = [
    { label: t('createProfile.selectExperience'), value: "" },
    { label: t('createProfile.lessThan1Year'), value: "less_than_1" },
    { label: t('createProfile.oneYear'), value: "1" },
    { label: t('createProfile.twoYears'), value: "2" },
    { label: t('createProfile.threeYears'), value: "3" },
    { label: t('createProfile.fourYears'), value: "4" },
    { label: t('createProfile.fiveYears'), value: "5" },
    { label: t('createProfile.sixYears'), value: "6" },
    { label: t('createProfile.sevenYears'), value: "7" },
    { label: t('createProfile.eightYears'), value: "8" },
    { label: t('createProfile.nineYears'), value: "9" },
    { label: t('createProfile.tenPlusYears'), value: "10_plus" },
  ];

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const text = (key, fallback) => {
    const translated = t(key);
    return !translated || translated === key ? fallback : translated;
  };

  const extractReadableMessage = (error) => {
    if (!error) return 'Something went wrong. Please try again.';

    if (typeof error === 'string') {
      try {
        const parsed = JSON.parse(error);
        return parsed?.message || parsed?.error || error;
      } catch {
        return error;
      }
    }

    if (error?.message && typeof error.message === 'string') {
      try {
        const parsed = JSON.parse(error.message);
        if (parsed?.errors && Array.isArray(parsed.errors)) {
          return parsed.errors.join('\n');
        }
        return parsed?.message || parsed?.error || error.message;
      } catch {
        return error.message;
      }
    }

    if (error?.errors && Array.isArray(error.errors)) {
      return error.errors.join('\n');
    }

    if (error?.data?.message) {
      return error.data.message;
    }

    return 'Something went wrong. Please try again.';
  };

  const showFeedback = (type, title, message) => {
    setFeedbackModal({
      visible: true,
      type,
      title,
      message,
    });
  };

  const handleFeedbackClose = () => {
    const modalType = feedbackModal.type;
    setFeedbackModal((prev) => ({ ...prev, visible: false }));

    if (modalType === 'success') {
      if (selectedRole === 'hire') {
        router.push('screens/user-hire');
      } else {
        router.push('(tabs)');
      }
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = () => {
    // Validate email and password step
    if (currentStep === 6 || (currentStep === 4 && !isWorker)) {
      if (!form.email || !validateEmail(form.email)) {
        alert(typeof t('createProfile.invalidEmail') === 'string' ? t('createProfile.invalidEmail') : 'Please enter a valid email address');
        return false;
      }
      if (!form.password) {
        alert('Please enter a password');
        return false;
      }
      if (form.password !== form.confirmPassword) {
        alert(typeof t('createProfile.passwordMismatch') === 'string' ? t('createProfile.passwordMismatch') : 'Passwords do not match');
        return false;
      }
    }
    if (currentStep === 2 && !form.phone) {
      alert(typeof t('messages.error') === 'string' ? t('messages.error') : 'Please enter a phone number to continue');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateStep()) {
      return;
    }

    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed - Submit to backend using TanStack Query
      await submitRegistration();
    }
  };

  const submitRegistration = async () => {
    try {
      // Prepare files array
      const files = [];

      // Add profile photo
      if (form.profilePhoto) {
        files.push({
          type: 'profilePhoto',
          uri: form.profilePhoto,
          name: `profile_${Date.now()}.jpg`,
        });
      }

      // Add shop photos (worker only)
      if (isWorker && form.shopPhotos.length > 0) {
        form.shopPhotos.forEach((photo, index) => {
          files.push({
            type: 'shopPhotos',
            uri: photo,
            name: `shop_${index}_${Date.now()}.jpg`,
          });
        });
      }

      // Add intro video (worker only)
      if (isWorker && form.introductoryVideo) {
        files.push({
          type: 'introVideo',
          uri: form.introductoryVideo.uri,
          name: `intro_${Date.now()}.mp4`,
        });
      }

      // Prepare registration data
      const backendRole = selectedRole === 'work' ? 'worker' : 'user';
      const userData = {
        fullName: form.name,
        phoneNumber: form.phone,
        email: form.email,
        password: form.password,
        role: backendRole,
        city: form.city,
        state: form.state,
        pincode: form.pin,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        // Worker-specific
        ...(isWorker && {
          education: form.education,
          yearsOfExperience: form.yearsOfExperience,
          skills: form.skills,
        }),
      };

      // Call mutation (TanStack Query handles loading and error states)
      await registerMutation.mutateAsync({ userData, files });

      showFeedback(
        'success',
        text('createProfile.successTitle', 'Registration Complete'),
        text('createProfile.successMessage', 'Your profile was created successfully.')
      );
    } catch (error) {
      console.error('Submit registration error:', error);
      const errorMessage = extractReadableMessage(error);
      showFeedback('error', 'Registration Failed', errorMessage);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handlePhotoUpload = () => {
    setShowPhotoOptions(true);
  };

  const pickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        alert("Camera permission is required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!result.canceled) {
        handleChange("profilePhoto", result.assets[0].uri);
        setShowPhotoOptions(false);
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("Failed to capture photo");
    }
  };

  const pickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Gallery permission is required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!result.canceled) {
        handleChange("profilePhoto", result.assets[0].uri);
        setShowPhotoOptions(false);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      alert("Failed to pick photo");
    }
  };

  const pickShopPhotos = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Gallery permission is required to select photos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0].uri;
        const updatedPhotos = [...form.shopPhotos, newPhoto];
        handleChange("shopPhotos", updatedPhotos);
        console.log("Photo added. Total photos:", updatedPhotos.length);
      } else {
        console.log("Photo selection cancelled");
      }
    } catch (error) {
      console.error("Gallery error:", error);
      alert("Error selecting photo: " + error.message);
    }
  };

  const removeShopPhoto = (uri) => {
    handleChange("shopPhotos", form.shopPhotos.filter((photo) => photo !== uri));
  };

  const pickIntroductoryVideo = async () => {
    try {
      setIsUploadingVideo(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Gallery permission is required to select videos");
        setIsUploadingVideo(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const video = result.assets[0];
        const videoDuration = video.duration ? video.duration / 1000 : 0; // Convert to seconds
        const maxDuration = 30; // 30 seconds max

        if (videoDuration > maxDuration) {
          alert(`Video is too long! Maximum duration is ${maxDuration} seconds, but your video is ${Math.round(videoDuration)} seconds.\n\nPlease select a shorter video.`);
          setIsUploadingVideo(false);
          return;
        }

        handleChange("introductoryVideo", {
          uri: video.uri,
          duration: videoDuration,
        });
        console.log("Video selected. Duration:", Math.round(videoDuration), "seconds");
      } else {
        console.log("Video selection cancelled");
      }
      setIsUploadingVideo(false);
    } catch (error) {
      console.error("Video picker error:", error);
      alert("Error selecting video: " + error.message);
      setIsUploadingVideo(false);
    }
  };

  const removeIntroductoryVideo = () => {
    handleChange("introductoryVideo", null);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      handleChange("skills", [...form.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    handleChange("skills", form.skills.filter((s) => s !== skillToRemove));
  };



  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#003f87" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isWorker ? t('createProfile.workerOnboarding') : t('createProfile.hiringOnboarding')}
        </Text>
        <Text style={styles.step}>
          {t('createProfile.step')} {currentStep} {t('createProfile.of')} {maxSteps}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.heading}>
          {currentStep === 1 && t('createProfile.profilePhoto')}
          {currentStep === 2 && t('createProfile.contactInformation')}
          {currentStep === 3 && t('createProfile.location')}
          {currentStep === 4 && isWorker && t('createProfile.skillsCertificate')}
          {currentStep === 4 && !isWorker && t('createProfile.accountSecurityDetails')}
          {currentStep === 5 && isWorker && t('createProfile.experienceMedia')}
          {currentStep === 6 && isWorker && t('createProfile.accountSecurityDetails')}
        </Text>
        <Text style={styles.description}>
          {currentStep === 1 && t('createProfile.uploadPhotoName')}
          {currentStep === 2 && t('createProfile.sharePhone')}
          {currentStep === 3 && t('createProfile.shareLocation')}
          {currentStep === 4 && isWorker && t('createProfile.addSkillsCert')}
          {currentStep === 4 && !isWorker && t('createProfile.createAccountDetails')}
          {currentStep === 5 && isWorker && t('createProfile.shareExperience')}
          {currentStep === 6 && isWorker && t('createProfile.createAccountDetails')}
        </Text>

        {/* Step 1: Profile Photo + Name */}
        {currentStep === 1 && (
          <View>
            {/* Profile Photo - Just the photo part from BasicDetails */}
            <Text style={styles.label}>{t('createProfile.profilePhotoLabel')}</Text>
            <TouchableOpacity style={styles.photoBox} onPress={handlePhotoUpload}>
              {form.profilePhoto ? (
                <Image 
                  source={{ uri: form.profilePhoto }} 
                  style={{ width: '100%', height: '100%', borderRadius: 60 }}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera" size={40} color="#ccc" />
                  <Text style={styles.photoPlaceholderText}>{t('createProfile.addPhoto')}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Full Name */}
            <Text style={styles.label}>{t('createProfile.fullName')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterFullName')}
                value={form.name}
                onChangeText={(text) => handleChange("name", text)}
              />
            </View>
          </View>
        )}

        {/* Step 2: Phone Number */}
        {currentStep === 2 && (
          <View>
            <Text style={styles.label}>{t('createProfile.phoneNumber')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterPhoneNumber')}
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => handleChange("phone", text)}
              />
            </View>
          </View>
        )}

        {/* Step 3: Location Details */}
        {currentStep === 3 && (
          <View>
            {/* City */}
            <Text style={styles.label}>{t('createProfile.city')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterCity')}
                value={form.city}
                onChangeText={(text) => handleChange("city", text)}
              />
            </View>

            {/* State */}
            <Text style={styles.label}>{t('createProfile.state')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="navigate-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterState')}
                value={form.state}
                onChangeText={(text) => handleChange("state", text)}
              />
            </View>

            {/* Pin Code */}
            <Text style={styles.label}>{t('createProfile.pinCode')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterPinCode')}
                keyboardType="numeric"
                maxLength={6}
                value={form.pin}
                onChangeText={(text) => handleChange("pin", text)}
              />
            </View>

            {/* Address Line 1 */}
            <Text style={styles.label}>{t('createProfile.addressLine1')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="home-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterAddressLine1')}
                value={form.addressLine1}
                onChangeText={(text) => handleChange("addressLine1", text)}
              />
            </View>

            {/* Address Line 2 */}
            <Text style={styles.label}>{t('createProfile.addressLine2')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="home-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterAddressLine2')}
                value={form.addressLine2}
                onChangeText={(text) => handleChange("addressLine2", text)}
              />
            </View>
          </View>
        )}

        {/* Step 4: Skills & Work Certificate (Worker only) */}
        {currentStep === 4 && isWorker && (
          <View>
            {/* Skills - Input Field */}
            <Text style={styles.label}>{t('createProfile.skills')}</Text>
            <View style={styles.skillInputContainer}>
              <TextInput
                style={styles.skillInput}
                placeholder={t('createProfile.enterSkill')}
                value={skillInput}
                onChangeText={setSkillInput}
              />
              <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Skills List */}
            {form.skills.length > 0 && (
              <View style={styles.skillsList}>
                {form.skills.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <Text style={styles.skillItemText}>{skill}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSkill(skill)}
                      style={styles.removeSkillButton}
                    >
                      <Ionicons name="close" size={18} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Work Certificate */}
            <Text style={styles.label}>{t('createProfile.educationQualification')}</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.education}
                onValueChange={(value) => handleChange("education", value)}
                style={styles.picker}
              >
                {educationOptions.map((option, index) => (
                  <Picker.Item 
                    key={index}
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Step 5: Experience & Media (Worker only) */}
        {currentStep === 5 && isWorker && (
          <View>
            {/* Years of Experience */}
            <Text style={styles.label}>{t('createProfile.yearsOfExperience')}</Text>
            <TouchableOpacity 
              style={styles.experienceDropdownButton}
              onPress={() => setShowExperienceDropdown(true)}
            >
              <Ionicons name="briefcase-outline" size={20} color="#003f87" />
              <Text style={styles.experienceDropdownButtonText}>
                {experienceOptions.find(opt => opt.value === form.yearsOfExperience)?.label || t('createProfile.selectExperience')}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#003f87" />
            </TouchableOpacity>

            {/* Shop Photos */}
            <Text style={styles.label}>{t('createProfile.shopPhotos')}</Text>
            <TouchableOpacity 
              style={styles.uploadBox} 
              onPress={pickShopPhotos}
            >
              <Ionicons name="images-outline" size={30} color="#ccc" />
              <Text style={styles.uploadBoxText}>
                {form.shopPhotos.length > 0 ? `${form.shopPhotos.length} ${t('createProfile.photosSelected')}` : t('createProfile.uploadPhotos')}
              </Text>
              <Text style={styles.uploadBoxHint}>{t('createProfile.tapToAddMore')}</Text>
            </TouchableOpacity>

            {/* Display Selected Shop Photos */}
            {form.shopPhotos.length > 0 && (
              <View style={styles.photosGrid}>
                {form.shopPhotos.map((photo, index) => (
                  <View key={index} style={styles.photoGridItem}>
                    <Image 
                      source={{ uri: photo }} 
                      style={styles.photoGridImage}
                    />
                    <TouchableOpacity 
                      style={styles.photoRemoveButton}
                      onPress={() => removeShopPhoto(photo)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Introductory Video */}
            <Text style={styles.label}>{t('createProfile.introductoryVideo')}</Text>
            {isUploadingVideo ? (
              <View style={styles.uploadBox}>
                <ActivityIndicator size="large" color="#003f87" />
                <Text style={styles.uploadBoxText}>{t('messages.uploading') || 'Uploading...'}</Text>
              </View>
            ) : form.introductoryVideo ? (
              <View style={styles.videoContainer}>
                <View style={styles.videoItem}>
                  <View style={styles.videoThumbnail}>
                    <Ionicons name="videocam" size={40} color="#003f87" />
                  </View>
                  <View style={styles.videoInfoContainer}>
                    <Text style={styles.videoInfoText}>
                      {Math.round(form.introductoryVideo.duration)}s {t('createProfile.videoSelected') || 'Video Selected'}
                    </Text>
                    <Text style={styles.videoHintText}>{t('createProfile.videoMaxDuration')}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.videoRemoveButton}
                    onPress={removeIntroductoryVideo}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBox} onPress={pickIntroductoryVideo}>
                <Ionicons name="videocam-outline" size={30} color="#ccc" />
                <Text style={styles.uploadBoxText}>
                  {t('createProfile.uploadVideoText')}
                </Text>
                <Text style={styles.videoHintText}>{t('createProfile.videoMaxDuration')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Step 6: Email & Password (Worker) - Step 4: Email & Password (Hirer) */}
        {(currentStep === 6 || (currentStep === 4 && !isWorker)) && (
          <View>
            {/* Email */}
            <Text style={styles.label}>{t('createProfile.email')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterEmail')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>{t('createProfile.password')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterPassword')}
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={18} 
                  color="#727784" 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Any password is accepted for now</Text>

            {/* Confirm Password */}
            <Text style={styles.label}>{t('createProfile.confirmPassword')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.confirmPasswordPlaceholder')}
                secureTextEntry={!showConfirmPassword}
                value={form.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={18} 
                  color="#727784" 
                />
              </TouchableOpacity>
            </View>
            {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
              <Text style={styles.errorText}>{t('createProfile.passwordMismatch')}</Text>
            )}
          </View>
        )}

        {/* Error Message */}
        {registerMutation.error && (
          <View style={styles.errorMessageBox}>
            <Ionicons name="alert-circle" size={20} color="#e53935" />
            <Text style={styles.errorMessageText}>{extractReadableMessage(registerMutation.error)}</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={20} color="#924c00" />
          <Text style={styles.infoText}>
            {t('messages.dataEncrypted')}
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity 
          style={[styles.button, registerMutation.isPending && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.buttonText}>
                {text('messages.submitting', 'Submitting...')}
              </Text>
            </>
          ) : (
            <Text style={styles.buttonText}>
              {currentStep === maxSteps ? text('buttons.complete', 'Complete') : text('buttons.next', 'Next')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Registration Feedback Modal */}
      <Modal
        visible={feedbackModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleFeedbackClose}
      >
        <View style={styles.feedbackOverlay}>
          <View style={styles.feedbackCard}>
            <View
              style={[
                styles.feedbackIconWrap,
                feedbackModal.type === 'success' ? styles.feedbackSuccess : styles.feedbackError,
              ]}
            >
              <Ionicons
                name={feedbackModal.type === 'success' ? 'checkmark' : 'close'}
                size={34}
                color="#fff"
              />
            </View>

            <Text style={styles.feedbackTitle}>{feedbackModal.title}</Text>
            <Text style={styles.feedbackMessage}>{feedbackModal.message}</Text>

            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={handleFeedbackClose}
            >
              <Text style={styles.feedbackButtonText}>{text('buttons.ok', 'OK')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Experience Dropdown Modal */}
      <Modal
        visible={showExperienceDropdown}
        transparent={true}
        onRequestClose={() => setShowExperienceDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.experienceDropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowExperienceDropdown(false)}
        >
          <View style={styles.experienceDropdownContent}>
            <View style={styles.experienceDropdownHeader}>
              <Text style={styles.experienceDropdownTitle}>{t('createProfile.selectExperience')}</Text>
              <TouchableOpacity onPress={() => setShowExperienceDropdown(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.experienceDropdownList}>
              {experienceOptions.map((option, index) => (
                option.value && (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.experienceDropdownItem,
                      form.yearsOfExperience === option.value && styles.experienceDropdownItemActive,
                    ]}
                    onPress={() => {
                      handleChange("yearsOfExperience", option.value);
                      setShowExperienceDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.experienceDropdownItemText,
                        form.yearsOfExperience === option.value && styles.experienceDropdownItemTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {form.yearsOfExperience === option.value && (
                      <Ionicons name="checkmark-circle" size={22} color="#003f87" />
                    )}
                  </TouchableOpacity>
                )
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Photo Options Modal */}
      <Modal
        visible={showPhotoOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('createProfile.selectPhoto')}</Text>
              <TouchableOpacity onPress={() => setShowPhotoOptions(false)}>
                <Ionicons name="close" size={24} color="#003f87" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={pickFromCamera}
            >
              <View style={styles.modalOptionContent}>
                <Ionicons name="camera" size={28} color="#003f87" />
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>{t('createProfile.takePhoto')}</Text>
                  <Text style={styles.modalOptionSubtitle}>{t('createProfile.useCamera')}</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={pickFromGallery}
            >
              <View style={styles.modalOptionContent}>
                <Ionicons name="image" size={28} color="#003f87" />
                <View style={styles.modalOptionText}>
                  <Text style={styles.modalOptionTitle}>{t('createProfile.chooseFromGallery')}</Text>
                  <Text style={styles.modalOptionSubtitle}>{t('createProfile.selectFromDevice')}</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowPhotoOptions(false)}
            >
              <Text style={styles.modalCancelButtonText}>{t('buttons.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fbf9f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: "#fbf9f8",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    color: "#003f87",
  },
  step: {
    fontSize: 12,
    color: "#666",
    paddingRight: 8,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    paddingTop: 24,
  },
  sectionTag: {
    color: "#003f87",
    fontWeight: "700",
    fontSize: 11,
    marginBottom: 8,
    letterSpacing: 1,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    lineHeight: 38,
    color: "#000",
  },
  description: {
    color: "#666",
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
    fontSize: 15,
    color: "#000",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#e0e0e0",
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 4,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
    padding: 14,
    backgroundColor: "#fef3e6",
    borderRadius: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#003f87",
    padding: 18,
    borderRadius: 12,
    marginTop: 32,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: "#999",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  errorMessageBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#ffebee",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#e53935",
  },
  errorMessageText: {
    fontSize: 13,
    color: "#c62828",
    fontWeight: "500",
    flex: 1,
  },
  photoBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignSelf: "center",
  },
  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  photoText: {
    fontSize: 14,
    color: "#003f87",
    fontWeight: "600",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 24,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  skillTagActive: {
    backgroundColor: "#003f87",
    borderColor: "#003f87",
  },
  skillTagText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  skillTagTextActive: {
    color: "#fff",
  },
  skillInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "#e8eef5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  skillInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  addSkillButton: {
    backgroundColor: "#003f87",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#003f87",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  skillsList: {
    marginTop: 20,
    marginBottom: 24,
  },
  skillItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f7ff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#003f87",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  skillItemText: {
    fontSize: 15,
    color: "#003f87",
    fontWeight: "600",
    flex: 1,
  },
  removeSkillButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#ffe6e6",
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",    
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 24,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  uploadBoxText: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  uploadBoxHint: {
    marginTop: 4,
    fontSize: 11,
    color: "#999",
    fontStyle: "italic",
  },
  pickerWrapper: {
    borderBottomWidth: 2,
    borderColor: "#e0e0e0",
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  picker: {
    height: 50,
    color: "#000",
    fontSize: 15,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  photoGridItem: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  photoGridImage: {
    width: "100%",
    height: "100%",
  },
  photoRemoveButton: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    marginBottom: 16,
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 12,
    color: "#e53935",
    marginTop: 6,
    marginBottom: 16,
    fontWeight: "500",
  },
  // OTP Styling
  otpSection: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  verifiedBanner: {
    marginTop: 16,
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#4caf50",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  verifiedText: {
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: "600",
  },
  resendButton: {
    paddingVertical: 12,
    marginTop: 12,
  },
  resendButtonText: {
    color: "#003f87",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#003f87",
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  primaryButtonDisabled: {
    backgroundColor: "#ccc",
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    backgroundColor: "#f5f7fa",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8eef5",
  },
  modalOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  modalOptionSubtitle: {
    fontSize: 12,
    color: "#999",
    fontWeight: "400",
  },
  modalOptionHint: {
    fontSize: 11,
    color: "#0066cc",
    fontWeight: "500",
    marginTop: 4,
    fontStyle: "italic",
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  feedbackOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  feedbackCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },
  feedbackIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  feedbackSuccess: {
    backgroundColor: '#16a34a',
  },
  feedbackError: {
    backgroundColor: '#dc2626',
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackMessage: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  feedbackButton: {
    backgroundColor: '#003f87',
    borderRadius: 12,
    minWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  videoDurationText: {
    marginTop: 4,
    fontSize: 12,
    color: "#4caf50",
    fontWeight: "600",
  },
  videoHintText: {
    marginTop: 4,
    fontSize: 10,
    color: "#0066cc",
    fontStyle: "italic",
  },
  videoContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e8eef5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  videoThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#e8eef5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  videoInfoContainer: {
    flex: 1,
  },
  videoInfoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003f87",
    marginBottom: 4,
  },
  videoRemoveButton: {
    padding: 4,
    marginLeft: 8,
  },
  experiencePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e8eef5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    gap: 10,
  },
  experiencePickerButtonText: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  optionsScroll: {
    flex: 1,
  },
  experienceOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    minHeight: 50,
  },
  experienceOptionSelected: {
    backgroundColor: "#f0f7ff",
    borderLeftWidth: 4,
    borderLeftColor: "#003f87",
    paddingLeft: 12,
  },
  experienceOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    flex: 1,
  },
  experienceOptionTextSelected: {
    color: "#003f87",
    fontWeight: "600",
  },
  experienceDropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    gap: 12,
  },
  experienceDropdownButtonText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  experienceDropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  experienceDropdownContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "85%",
    maxHeight: "70%",
    paddingTop: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  experienceDropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  experienceDropdownTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003f87",
  },
  experienceDropdownList: {
    paddingVertical: 8,
  },
  experienceDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  experienceDropdownItemActive: {
    backgroundColor: "#f0f7ff",
    borderLeftWidth: 4,
    borderLeftColor: "#003f87",
    paddingLeft: 12,
  },
  experienceDropdownItemText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "400",
    flex: 1,
  },
  experienceDropdownItemTextActive: {
    color: "#003f87",
    fontWeight: "600",
  },
});