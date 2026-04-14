import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/$/, '');

export default function WorkerProfile() {
  const router = useRouter();
  const { workerId } = useLocalSearchParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/workers/${workerId}`);
        const data = await response.json();
        
        if (data.success) {
          setWorker(data.data);
          console.log("Worker profile loaded:", data.data);
        }
      } catch (error) {
        console.error('Error fetching worker details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (workerId) {
      fetchWorkerDetails();
    }
  }, [workerId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#003f87" />
          </TouchableOpacity>
          <Text style={styles.logo}>Worker Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#003f87" />
        </View>
      </View>
    );
  }

  if (!worker) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#003f87" />
          </TouchableOpacity>
          <Text style={styles.logo}>Worker Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#999" }}>Worker not found</Text>
        </View>
      </View>
    );
  }

  const firstSkill = worker?.skills?.[0] || "Worker";
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${firstSkill}&background=random&color=fff&bold=true&size=400`;
  const profilePhoto = worker?.media?.profilePhoto || fallbackAvatar;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#003f87" />
          </TouchableOpacity>
          <Text style={styles.logo}>Worker Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* PROFILE PHOTO */}
        <View style={styles.photoContainer}>
          <Image 
            source={{ uri: profilePhoto }} 
            style={styles.profilePhoto}
          />
        </View>

        {/* RATING */}
        {worker?.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={styles.ratingText}>
              {worker.rating.averageRating || 0} ({worker.rating.totalReviews || 0} reviews)
            </Text>
          </View>
        )}

        {/* NAME & LOCATION */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{worker?.userId?.fullName || "Worker"}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#999" />
            <Text style={styles.location}>
              {worker?.userId?.location?.city || ""}, {worker?.userId?.location?.state || ""}
            </Text>
          </View>
        </View>

        {/* SKILLS */}
        {worker?.skills && worker.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚒️ Skills</Text>
            <View style={styles.skillsContainer}>
              {worker.skills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* EXPERIENCE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Experience</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Years of Experience:</Text>
            <Text style={styles.value}>{worker?.experienceYears || 0} years</Text>
          </View>
        </View>

        {/* EDUCATION */}
        {worker?.education && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎓 Education</Text>
            <Text style={styles.value}>{worker.education}</Text>
          </View>
        )}

        {/* AVAILABILITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Availability</Text>
          <View style={[styles.statusBadge, worker?.isAvailable ? styles.availableBadge : styles.busyBadge]}>
            <Text style={styles.statusText}>
              {worker?.isAvailable ? "Available" : "Busy"}
            </Text>
          </View>
        </View>

        {/* HOURLY RATE */}
        {worker?.hourlyRate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Hourly Rate</Text>
            <Text style={styles.value}>₹{worker.hourlyRate}/hour</Text>
          </View>
        )}

        {/* BIO */}
        {worker?.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 About</Text>
            <Text style={styles.bio}>{worker.bio}</Text>
          </View>
        )}

        {/* SHOP PHOTOS */}
        {worker?.media?.shopPhotos && worker.media.shopPhotos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Shop Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopPhotosContainer}>
              {worker.media.shopPhotos.map((photo, index) => (
                <Image 
                  key={index}
                  source={{ uri: photo }} 
                  style={styles.shopPhoto}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* INTRO VIDEO */}
        {worker?.media?.introductoryVideo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎥 Introduction Video</Text>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={48} color="#003f87" />
              <Text style={styles.videoText}>Tap to play video</Text>
            </View>
          </View>
        )}

        {/* CONTACT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contact</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Call Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactButton, styles.messageButton]}>
            <Ionicons name="chatbubble" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003f87",
  },

  photoContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },

  profilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#003f87",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    gap: 8,
  },

  ratingText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },

  infoSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  location: {
    fontSize: 14,
    color: "#666",
  },

  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  skillTag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#003f87",
  },

  skillText: {
    color: "#003f87",
    fontSize: 13,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: "#666",
  },

  value: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
  },

  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  availableBadge: {
    backgroundColor: "#e8f5e9",
  },

  busyBadge: {
    backgroundColor: "#ffebee",
  },

  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },

  bio: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  shopPhotosContainer: {
    marginVertical: 8,
  },

  shopPhoto: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },

  videoPlaceholder: {
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  videoText: {
    color: "#666",
    fontSize: 14,
  },

  contactButton: {
    backgroundColor: "#003f87",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    gap: 8,
  },

  messageButton: {
    backgroundColor: "#0055d4",
  },

  contactButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
