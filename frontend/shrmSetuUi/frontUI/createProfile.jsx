import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { LanguageContext } from "../../context/LanguageContext";
import BasicDetails from "../formDetails/BasicDetails";

export default function CreateProfile() {
  const { t } = useI18nextTranslation();
  const { language } = useContext(LanguageContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedRole = params?.role;

  const isWorker = selectedRole === "work";
  const maxSteps = isWorker ? 6 : 4;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    workCertificate: null,
    yearsOfExperience: "",
    shopPhotos: [],
    introductoryVideo: null,
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
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
      if (!form.password || form.password.length < 8) {
        alert(typeof t('createProfile.passwordRequirements') === 'string' ? t('createProfile.passwordRequirements') : 'Password must be at least 8 characters');
        return false;
      }
      if (form.password !== form.confirmPassword) {
        alert(typeof t('createProfile.passwordMismatch') === 'string' ? t('createProfile.passwordMismatch') : 'Passwords do not match');
        return false;
      }
    }
    // Validate OTP verification
    if (currentStep === 2 && !otpVerified) {
      alert(typeof t('messages.error') === 'string' ? t('messages.error') : 'An error occurred');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateStep()) {
      return;
    }
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed
      console.log("Profile created:", { ...form, role: selectedRole });
      // Navigate to (tabs) for both - shows Dashboard with tabs for workers, Home for hirers
      router.push("(tabs)");
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
    // TODO: Implement photo upload functionality
    console.log("Upload photo pressed");
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

  const handleSendOTP = () => {
    if (form.phone.length >= 10) {
      setOtpSent(true);
      console.log("OTP sent to", form.phone);
      // TODO: Implement actual OTP API call
    } else {
      alert(t('messages.error'));
    }
  };

  const handleVerifyOTP = () => {
    if (otpInput.length === 6) {
      setOtpVerified(true);
      console.log("OTP verified:", otpInput);
      // TODO: Implement actual OTP verification API call
    } else {
      alert(t('messages.error'));
    }
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
                <Text style={styles.photoText}>{form.profilePhoto}</Text>
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

        {/* Step 2: Phone + OTP Verification */}
        {currentStep === 2 && (
          <View>
            {/* Phone Number */}
            <Text style={styles.label}>{t('createProfile.phoneNumber')}</Text>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.phoneInputContainer}>
                <Ionicons name="call-outline" size={18} color="#727784" />
                <TextInput
                  style={styles.phoneInput}
                  placeholder={t('createProfile.enterPhoneNumber')}
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  editable={!otpSent}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.sendOTPButton,
                  otpSent && styles.sendOTPButtonDisabled,
                ]}
                onPress={handleSendOTP}
                disabled={otpSent}
              >
                <Text style={styles.sendOTPButtonText}>
                  {otpSent ? t('createProfile.otpSent') : t('createProfile.sendOTP')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* OTP Verification Section */}
            {otpSent && !otpVerified && (
              <View style={styles.otpSection}>
                <Text style={styles.label}>{t('createProfile.otp')}</Text>
                <View style={styles.otpInputWrapper}>
                  <View style={styles.otpInputContainer}>
                    <Ionicons name="shield-checkmark-outline" size={18} color="#003f87" />
                    <TextInput
                      style={styles.otpInput}
                      placeholder={t('createProfile.enterOTP')}
                      keyboardType="numeric"
                      maxLength={6}
                      value={otpInput}
                      onChangeText={setOtpInput}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={handleVerifyOTP}
                  >
                    <Text style={styles.verifyButtonText}>{t('createProfile.verifyOTP')}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={() => {
                    setOtpSent(false);
                    setOtpInput("");
                  }}
                >
                  <Text style={styles.resendButtonText}>{t('createProfile.resendOTP')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Verified Status */}
            {otpVerified && (
              <View style={styles.verifiedBanner}>
                <Ionicons name="checkmark-circle" size={24} color="#228B22" />
                <Text style={styles.verifiedText}>{t('createProfile.otpVerified')}</Text>
              </View>
            )}
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
            <Text style={styles.label}>{t('createProfile.workCertificate')}</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={() => console.log("Upload PDF")}>
              <Ionicons name="document-outline" size={30} color="#ccc" />
              <Text style={styles.uploadBoxText}>
                {form.workCertificate ? t('createProfile.pdfUploaded') : t('createProfile.uploadPDF')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 5: Experience & Media (Worker only) */}
        {currentStep === 5 && isWorker && (
          <View>
            {/* Years of Experience */}
            <Text style={styles.label}>{t('createProfile.yearsOfExperience')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="briefcase-outline" size={18} color="#727784" />
              <TextInput
                style={styles.input}
                placeholder={t('createProfile.enterYearsOfExperience')}
                keyboardType="numeric"
                value={form.yearsOfExperience}
                onChangeText={(text) => handleChange("yearsOfExperience", text)}
              />
            </View>

            {/* Shop Photos */}
            <Text style={styles.label}>{t('createProfile.shopPhotos')}</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={() => console.log("Upload photos")}>
              <Ionicons name="images-outline" size={30} color="#ccc" />
              <Text style={styles.uploadBoxText}>
                {form.shopPhotos.length > 0 ? `${form.shopPhotos.length} Photos` : t('createProfile.uploadPhotos')}
              </Text>
            </TouchableOpacity>

            {/* Introductory Video */}
            <Text style={styles.label}>{t('createProfile.introductoryVideo')}</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={() => console.log("Upload video")}>
              <Ionicons name="videocam-outline" size={30} color="#ccc" />
              <Text style={styles.uploadBoxText}>
                {form.introductoryVideo ? t('createProfile.videoUploaded') : t('createProfile.uploadVideo')}
              </Text>
            </TouchableOpacity>
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
            <Text style={styles.helperText}>{t('createProfile.passwordRequirements')}</Text>

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

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={20} color="#924c00" />
          <Text style={styles.infoText}>
            {t('messages.dataEncrypted')}
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>
            {currentStep === maxSteps ? t('buttons.complete') : t('buttons.next')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: 55,
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
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
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
  // OTP Styling
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  sendOTPButton: {
    backgroundColor: "#003f87",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    flexShrink: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  sendOTPButtonDisabled: {
    backgroundColor: "#ccc",
    elevation: 0,
    shadowOpacity: 0,
  },
  sendOTPButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  otpSection: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  otpInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  otpInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  otpInput: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    letterSpacing: 4,
  },
  verifyButton: {
    backgroundColor: "#003f87",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    flexShrink: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendButtonText: {
    color: "#003f87",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  verifiedBanner: {
    marginTop: 12,
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
    flex: 1,
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
});