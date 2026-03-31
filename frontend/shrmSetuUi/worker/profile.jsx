import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  // State management
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePhoto: "https://via.placeholder.com/200",
    name: "Marcus Sterling",
    email: "marcus.sterling@email.com",
    password: "••••••••••",
    phone: "+1 (555) 234-8901",
    addressLine1: "742 Evergreen Terrace",
    addressLine2: "Apt 5B",
    city: "Springfield",
    state: "Illinois",
    pin: "62704",
    skills: ["Cabinetry", "Restoration", "CNC", "Wood Finishing", "Design"],
    workCertificate: "OSHA_Certified_2023.pdf",
    yearsOfExperience: "12",
    shopPhotos: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
    introductoryVideo: "portfolio_video.mp4",
  });

  const handlePhotoUpload = () => {
    Alert.alert("Upload Photo", "Choose a photo from camera or gallery", [
      {
        text: "Camera",
        onPress: () => {
          console.log("Camera pressed");
          // TODO: Implement camera functionality
          setShowPhotoOptions(false);
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          console.log("Gallery pressed");
          // TODO: Implement gallery functionality
          setShowPhotoOptions(false);
        },
      },
      {
        text: "Cancel",
        onPress: () => setShowPhotoOptions(false),
        style: "cancel",
      },
    ]);
  };

  const renderSkillTag = ({ item }) => (
    <View style={styles.skillTag}>
      <Ionicons name="checkmark-circle" size={14} color="#fff" />
      <Text style={styles.skillTagText}>{item}</Text>
    </View>
  );

  const renderShopPhoto = ({ item }) => (
    <Image source={{ uri: item }} style={styles.shopPhoto} />
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO SECTION WITH GRADIENT */}
        <LinearGradient
          colors={["#003f87", "#0052cc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          {/* PROFILE PHOTO - CLICKABLE TO EDIT */}
          <TouchableOpacity
            style={styles.photoEditContainer}
            onPress={handlePhotoUpload}
          >
            <Image
              source={{ uri: profileData.profilePhoto }}
              style={styles.profileImage}
            />
            <View style={styles.editPhotoOverlay}>
              <Ionicons name="camera" size={32} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.heroName}>{profileData.name}</Text>
          <Text style={styles.heroTitle}>Senior Professional</Text>
          <View style={styles.experienceBadge}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={styles.experienceText}>{profileData.yearsOfExperience} Years Experience</Text>
          </View>
        </LinearGradient>

        {/* BASIC INFO CARD */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={24} color="#003f87" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.infoCard}>
            {/* Email */}
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="mail-outline" size={20} color="#003f87" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{profileData.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Password */}
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="lock-closed-outline" size={20} color="#003f87" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Password</Text>
                <Text style={styles.infoValue}>{profileData.password}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="create-outline" size={20} color="#003f87" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Phone */}
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="call-outline" size={20} color="#003f87" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{profileData.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Experience */}
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="briefcase-outline" size={20} color="#228B22" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Years of Experience</Text>
                <Text style={styles.infoValue}>{profileData.yearsOfExperience} years</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ADDRESS SECTION */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-sharp" size={24} color="#003f87" />
            <Text style={styles.sectionTitle}>Address</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="home-outline" size={20} color="#003f87" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoValue}>{profileData.addressLine1}</Text>
                {profileData.addressLine2 && (
                  <Text style={styles.infoValue}>{profileData.addressLine2}</Text>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.addressRow}>
              <View style={styles.addressItem}>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>{profileData.city}</Text>
              </View>
              <View style={styles.addressItem}>
                <Text style={styles.infoLabel}>State</Text>
                <Text style={styles.infoValue}>{profileData.state}</Text>
              </View>
              <View style={styles.addressItem}>
                <Text style={styles.infoLabel}>PIN</Text>
                <Text style={styles.infoValue}>{profileData.pin}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SKILLS SECTION */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#003f87" />
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          </View>

          <View style={styles.skillsContainer}>
            <FlatList
              data={profileData.skills}
              renderItem={renderSkillTag}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={styles.skillsRow}
            />
          </View>
        </View>

        {/* CERTIFICATION SECTION */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={24} color="#003f87" />
            <Text style={styles.sectionTitle}>Certifications</Text>
          </View>

          <TouchableOpacity style={styles.certificateCard}>
            <View style={styles.certificateIcon}>
              <Ionicons name="document-attach" size={28} color="#003f87" />
            </View>
            <View style={styles.certificateContent}>
              <Text style={styles.certificateName}>{profileData.workCertificate}</Text>
              <Text style={styles.certificateStatus}>✓ Verified</Text>
            </View>
            <Ionicons name="download-outline" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* PORTFOLIO SECTION */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Ionicons name="images" size={24} color="#003f87" />
            <Text style={styles.sectionTitle}>Portfolio</Text>
          </View>

          <FlatList
            data={profileData.shopPhotos}
            renderItem={renderShopPhoto}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            numColumns={3}
            columnWrapperStyle={styles.photoRow}
          />
        </View>

        {/* VIDEO SECTION */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Ionicons name="play-circle" size={24} color="#003f87" />
            <Text style={styles.sectionTitle}>Introduction Video</Text>
          </View>

          <TouchableOpacity style={styles.videoCard}>
            <Ionicons name="play" size={48} color="#fff" />
            <Text style={styles.videoFileName}>{profileData.introductoryVideo}</Text>
            <Text style={styles.videoSubtext}>Click to play</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // HERO SECTION
  heroSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  photoEditContainer: {
    position: "relative",
    marginBottom: 16,
  },

  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#fff",
  },

  editPhotoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },

  heroName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },

  heroTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 12,
  },

  experienceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },

  experienceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // SECTIONS
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003f87",
  },

  // CARDS
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },

  addressRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },

  addressItem: {
    flex: 1,
  },

  // SKILLS
  skillsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  skillsRow: {
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },

  skillTag: {
    flex: 1,
    backgroundColor: "#003f87",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
  },

  skillTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // CERTIFICATE
  certificateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  certificateIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
  },

  certificateContent: {
    flex: 1,
  },

  certificateName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#003f87",
    marginBottom: 2,
  },

  certificateStatus: {
    fontSize: 12,
    color: "#228B22",
    fontWeight: "600",
  },

  // PORTFOLIO
  photoRow: {
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },

  shopPhoto: {
    width: "32%",
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },

  // VIDEO
  videoCard: {
    backgroundColor: "#003f87",
    borderRadius: 12,
    paddingVertical: 40,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  videoFileName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  videoSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
});