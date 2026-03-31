import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * BasicDetails Component
 * Reusable component for collecting Name, Phone, Address, and Profile Photo
 * Can be used by both Worker and Normal User onboarding flows
 */

export default function BasicDetails({
  form = {},
  handleChange = () => {},
  handlePhotoUpload = () => {},
}) {
  return (
    <View style={styles.container}>
      {/* Profile Photo */}
      <View style={styles.photoSection}>
        <TouchableOpacity 
          style={styles.photoBox}
          onPress={handlePhotoUpload}
        >
          {form.profilePhoto ? (
            <Image
              source={{ uri: form.profilePhoto }}
              style={styles.profilePhoto}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={40} color="#003f87" />
              <Text style={styles.photoText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={18} color="#727784" />
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={form.name || ""}
          onChangeText={(text) => handleChange("name", text)}
        />
      </View>

      {/* Phone */}
      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="call-outline" size={18} color="#727784" />
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={form.phone || ""}
          onChangeText={(text) => handleChange("phone", text)}
          keyboardType="phone-pad"
        />
      </View>

      {/* Address */}
      <Text style={styles.label}>Address</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name="home-outline" size={18} color="#727784" />
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={form.address || ""}
          onChangeText={(text) => handleChange("address", text)}
          multiline
          numberOfLines={2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  photoBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  photoText: {
    fontSize: 12,
    color: "#003f87",
    fontWeight: "600",
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
    alignItems: "flex-start",
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
});
