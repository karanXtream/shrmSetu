import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { workerAPI } from "../../services/api";
import { useAuth } from "../../providers/RootProvider";

export default function Profile() {
  const route = useRoute();
  const navigation = useNavigation();
  const { logout } = useAuth();
  // State management
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workerData, setWorkerData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState({
    profilePhoto: "https://via.placeholder.com/200",
    name: "Loading...",
    email: "loading...",
    password: "••••••••••",
    phone: "loading...",
    addressLine1: "loading...",
    addressLine2: "",
    city: "loading...",
    state: "loading...",
    pin: "loading...",
    skills: [],
    workCertificate: "Not available",
    yearsOfExperience: "0",
    shopPhotos: [],
    introductoryVideo: "Not available",
    bio: "No bio added yet",
    hourlyRate: "0",
    rating: 0,
    totalReviews: 0,
    education: "Not specified",
    isAvailable: false,
  });

  // Fetch worker profile data
  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user ID from route params or AsyncStorage
        let userId = route.params?.userId;
        
        if (!userId) {
          const userJson = await AsyncStorage.getItem("userData");
          if (userJson) {
            const user = JSON.parse(userJson);
            userId = user._id || user.id;
          }
        }

        if (!userId) {
          throw new Error("User ID not found");
        }

        console.log("Fetching worker profile for userId:", userId);

        // Call API to get worker profile
        const response = await workerAPI.getProfile(userId);
        
        console.log("Worker profile response:", response);

        if (response?.data) {
          const worker = response.data.data || response.data;
          setWorkerData(worker);

          // Update profile data with fetched information
          const updatedProfileData = {
            profilePhoto: worker.media?.profilePhoto || "https://via.placeholder.com/200",
            name: worker.userId?.fullName || "Worker Name",
            email: worker.userId?.email || "No email",
            password: "••••••••••",
            phone: worker.userId?.phoneNumber || "No phone",
            addressLine1: worker.userId?.location?.addressLine1 || "No address",
            addressLine2: worker.userId?.location?.addressLine2 || "",
            city: worker.userId?.location?.city || "No city",
            state: worker.userId?.location?.state || "No state",
            pin: worker.userId?.location?.pincode || "No PIN",
            skills: worker.skills || [],
            workCertificate: "Verified",
            yearsOfExperience: worker.experienceYears?.toString() || "0",
            shopPhotos: worker.media?.shopPhotos || [],
            introductoryVideo: worker.media?.introductoryVideo || "Not available",
            bio: worker.bio || "No bio added yet",
            hourlyRate: worker.hourlyRate?.toString() || "0",
            rating: worker.rating?.averageRating || 0,
            totalReviews: worker.rating?.totalReviews || 0,
            education: worker.education || "Not specified",
            isAvailable: worker.isAvailable || false,
          };

          setProfileData(updatedProfileData);
          setUserData(worker.userId);
        }
      } catch (err) {
        console.error("Error fetching worker profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkerProfile();
  }, [route.params?.userId]);

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
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
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
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003f87" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={32} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!isLoading && !error && (
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

        {/* RATING & REVIEWS SECTION */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Ionicons name="star" size={24} color="#ffc107" />
            <Text style={styles.sectionTitle}>Rating & Reviews</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingScore}>{profileData.rating.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < Math.floor(profileData.rating) ? "star" : "star-outline"}
                      size={16}
                      color={i < Math.floor(profileData.rating) ? "#ffc107" : "#e5e7eb"}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.reviewsBox}>
                <Text style={styles.reviewsText}>{profileData.totalReviews}</Text>
                <Text style={styles.reviewsLabel}>Total Reviews</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BIO SECTION */}
        {profileData.bio && profileData.bio !== "No bio added yet" && (
          <View style={styles.section}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text" size={24} color="#003f87" />
              <Text style={styles.sectionTitle}>About</Text>
            </View>

            <View style={styles.bioCard}>
              <Text style={styles.bioText}>{profileData.bio}</Text>
            </View>
          </View>
        )}

        {/* PROFESSIONAL INFO SECTION */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Ionicons name="briefcase" size={24} color="#003f87" />
            <Text style={styles.sectionTitle}>Professional Information</Text>
          </View>

          <View style={styles.infoCard}>
            {/* Hourly Rate */}
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="cash" size={20} color="#003f87" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Hourly Rate</Text>
                <Text style={styles.infoValue}>₹{profileData.hourlyRate}/hour</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Education */}
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons name="school" size={20} color="#003f87" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Education</Text>
                <Text style={styles.infoValue}>{profileData.education}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Availability Status */}
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={profileData.isAvailable ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={profileData.isAvailable ? "#10b981" : "#ef4444"}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Availability Status</Text>
                <Text style={[styles.infoValue, { color: profileData.isAvailable ? "#10b981" : "#ef4444" }]}>
                  {profileData.isAvailable ? "Available for work" : "Currently unavailable"}
                </Text>
              </View>
            </View>
          </View>
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

        {/* LOGOUT SECTION */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      )}
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

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },

  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#dc2626",
    textAlign: "center",
    fontWeight: "500",
  },

  // Rating Section
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
  },

  ratingBox: {
    alignItems: "center",
  },

  ratingScore: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffc107",
  },

  starsContainer: {
    flexDirection: "row",
    marginTop: 8,
    gap: 4,
  },

  reviewsBox: {
    alignItems: "center",
  },

  reviewsText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003f87",
  },

  reviewsLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },

  // Bio Section
  bioCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#003f87",
  },

  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1f2937",
    fontWeight: "400",
  },

  // LOGOUT BUTTON
  logoutButton: {
    backgroundColor: "#dc2626",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },

  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});