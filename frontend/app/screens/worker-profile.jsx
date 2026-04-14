import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/$/, '');

export default function WorkerProfile() {
  const router = useRouter();
  const { workerId, chatData, negotiationAmount } = useLocalSearchParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [parsedNegotiationAmount, setParsedNegotiationAmount] = useState('');

  // Read negotiationAmount from AsyncStorage
  useEffect(() => {
    const loadNegotiationAmount = async () => {
      try {
        console.log('💰 [AMOUNT-LOAD] ========= START ==========');
        console.log('💰 [AMOUNT-LOAD] Input params - workerId:', workerId, 'negotiationAmount:', negotiationAmount);
        
        // Attempt 1: Route parameter (strongest source)
        console.log('💰 [AMOUNT-LOAD] [1/3] Checking ROUTE PARAM...');
        const routeAmount = Array.isArray(negotiationAmount)
          ? negotiationAmount[0]
          : negotiationAmount;
        console.log('💰 [AMOUNT-LOAD]   Raw routeAmount:', routeAmount, 'Type:', typeof routeAmount, 'IsArray:', Array.isArray(negotiationAmount));

        if (routeAmount && String(routeAmount).trim() !== '' && String(routeAmount) !== 'null' && String(routeAmount) !== 'undefined') {
          const finalAmount = String(routeAmount).trim();
          console.log('✅ [1/3] SUCCESS - Using ROUTE PARAM:', finalAmount);
          setParsedNegotiationAmount(finalAmount);
          console.log('💰 [AMOUNT-LOAD] ========= END (SOURCE: ROUTE) ==========');
          return;
        }
        console.log('❌ [1/3] FAILED - Route param is empty/null');

        // Attempt 2: Lookup from saved applications by workerId
        console.log('💰 [AMOUNT-LOAD] [2/3] Checking SAVED APPLICATIONS...');
        const savedApplications = await AsyncStorage.getItem('workerApplications');
        console.log('💰 [AMOUNT-LOAD]   Raw savedApplications:', savedApplications ? 'EXISTS (length:' + savedApplications.length + ')' : 'NULL');
        
        if (savedApplications) {
          const applications = JSON.parse(savedApplications);
          console.log('💰 [AMOUNT-LOAD]   Parsed applications count:', applications.length);
          applications.forEach((app, idx) => {
            console.log(`    [${idx}] id="${app.id}" matches workerId "${workerId}"? ${String(app.id) === String(workerId)}`);
          });
          
          const matched = applications.find((item) => String(item.id) === String(workerId));
          console.log('💰 [AMOUNT-LOAD]   Matched application found?', matched ? 'YES' : 'NO');
          
          if (matched) {
            console.log('💰 [AMOUNT-LOAD]   Matched app amount:', matched.negotiationAmount, 'Type:', typeof matched.negotiationAmount);
          }
          
          if (matched && matched.negotiationAmount) {
            const finalAmount = String(matched.negotiationAmount).trim();
            console.log('✅ [2/3] SUCCESS - Using SAVED APPLICATION:', finalAmount);
            setParsedNegotiationAmount(finalAmount);
            console.log('💰 [AMOUNT-LOAD] ========= END (SOURCE: SAVED) ==========');
            return;
          }
        }
        console.log('❌ [2/3] FAILED - No saved applications or no match');

        // Attempt 3: Fallback temp storage key
        console.log('💰 [AMOUNT-LOAD] [3/3] Checking TEMP STORAGE...');
        const storedAmount = await AsyncStorage.getItem('tempNegotiationAmount');
        console.log('💰 [AMOUNT-LOAD]   Raw storedAmount:', storedAmount ? `"${storedAmount}"` : 'NULL');
        console.log('💰 [AMOUNT-LOAD]   Trim check:', storedAmount ? `"${String(storedAmount).trim()}"` : 'N/A');
        
        if (storedAmount && String(storedAmount).trim() !== '' && String(storedAmount) !== 'null') {
          const finalAmount = String(storedAmount).trim();
          console.log('✅ [3/3] SUCCESS - Using TEMP KEY:', finalAmount);
          setParsedNegotiationAmount(finalAmount);
          await AsyncStorage.removeItem('tempNegotiationAmount');
          console.log('💰 [AMOUNT-LOAD] ========= END (SOURCE: TEMP) ==========');
          return;
        }
        console.log('❌ [3/3] FAILED - Temp storage empty');

        // No amount found
        console.log('❌ [0/3] NO AMOUNT FOUND FROM ANY SOURCE - setting to empty');
        setParsedNegotiationAmount('');
        console.log('💰 [AMOUNT-LOAD] ========= END (NO SOURCE) ==========');
      } catch (e) {
        console.error('❌ Error load negotiationAmount:', e);
        setParsedNegotiationAmount('');
      }
    };
    
    loadNegotiationAmount();
  }, [workerId, negotiationAmount]);

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching worker with ID:", workerId);
        console.log("API URL:", API_URL);
        
        if (!workerId) {
          setError("No worker ID provided");
          setLoading(false);
          return;
        }

        const url = `${API_URL}/api/workers/${workerId}`;
        console.log("Full URL:", url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("Worker response status:", response.status);
        console.log("Worker response data:", data);
        
        if (data.success && data.data) {
          setWorker(data.data);
          console.log("Worker profile loaded successfully");
        } else {
          setError(data.message || "Failed to load worker profile");
        }
      } catch (error) {
        console.error('Error fetching worker details:', error);
        setError(error.message || "Failed to fetch worker profile");
      } finally {
        setLoading(false);
      }
    };

    if (workerId) {
      fetchWorkerDetails();
    }
  }, [workerId]);

  const handleCall = async () => {
    const phoneNumber = worker?.userId?.phoneNumber;
    if (!phoneNumber) {
      Alert.alert("Phone Number", "Phone number is not available for this worker");
      return;
    }
    
    try {
      const url = `tel:${phoneNumber}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to make calls on this device");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open phone dialer");
      console.error("Error making call:", error);
    }
  };

  const handleSendMessage = async () => {
    const phoneNumber = worker?.userId?.phoneNumber;
    if (!phoneNumber) {
      Alert.alert("Phone Number", "Phone number is not available for this worker");
      return;
    }
    
    try {
      const url = `sms:${phoneNumber}`;
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to send SMS on this device");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open SMS");
      console.error("Error sending message:", error);
    }
  };

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
          <Text style={{ marginTop: 12, color: "#999" }}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error || !worker) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#003f87" />
          </TouchableOpacity>
          <Text style={styles.logo}>Worker Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          <Ionicons name="alert-circle" size={48} color="#f44336" />
          <Text style={{ color: "#333", fontSize: 16, marginTop: 12, textAlign: "center", fontWeight: "bold" }}>
            {error || "Worker not found"}
          </Text>
          <Text style={{ color: "#999", fontSize: 14, marginTop: 8, textAlign: "center" }}>
            Worker ID: {workerId}
          </Text>
          <TouchableOpacity style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#003f87", borderRadius: 8 }}>
            <Text style={{ color: "#fff", fontWeight: "bold" }} onPress={() => router.back()}>Go Back</Text>
          </TouchableOpacity>
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
          <Text style={styles.logo}>Profile</Text>
        </View>

        {/* PROFILE PHOTO */}
        <View style={styles.photoContainer}>
          <Image 
            source={{ uri: profilePhoto }} 
            style={styles.profilePhoto}
          />
        </View>

        {/* NAME & LOCATION */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{worker?.userId?.fullName || "Worker"}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#999" />
            <Text style={styles.location}>
              {worker?.userId?.location?.city || ""}, {worker?.userId?.location?.state || ""}
            </Text>
          </View>
          {worker?.userId?.phoneNumber && (
            <View style={styles.locationRow}>
              <Ionicons name="call" size={16} color="#999" />
              <Text style={styles.location}>{worker.userId.phoneNumber}</Text>
            </View>
          )}
          {worker?.userId?.email && (
            <View style={styles.locationRow}>
              <Ionicons name="mail" size={16} color="#999" />
              <Text style={styles.location}>{worker.userId.email}</Text>
            </View>
          )}
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
          <Text style={styles.sectionTitle}>🔔 Availability Status</Text>
          <View style={[styles.statusBadge, worker?.isAvailable ? styles.availableBadge : styles.busyBadge]}>
            <Ionicons name={worker?.isAvailable ? "checkmark-circle" : "close-circle"} size={18} color={worker?.isAvailable ? "#4caf50" : "#f44336"} />
            <Text style={styles.statusText}>
              {worker?.isAvailable ? "Available for work" : "Currently Busy"}
            </Text>
          </View>
        </View>

        {/* HOURLY RATE */}
        {worker?.hourlyRate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Hourly Rate</Text>
            <Text style={[styles.value, { fontSize: 18, color: "#d9534f" }]}>₹{worker.hourlyRate}/hour</Text>
          </View>
        )}

        {/* BIO */}
        {worker?.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 About</Text>
            <Text style={styles.bio}>{worker.bio}</Text>
          </View>
        )}

        {/* ADDRESS */}
        {worker?.userId?.location?.addressLine1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Full Address</Text>
            <Text style={styles.bio}>
              {worker.userId.location.addressLine1}
              {worker.userId.location.addressLine2 ? ", " + worker.userId.location.addressLine2 : ""}
              {"\n"}{worker.userId.location.city}, {worker.userId.location.state} - {worker.userId.location.pincode}
            </Text>
          </View>
        )}

        {/* SHOP PHOTOS */}
        {worker?.media?.shopPhotos && worker.media.shopPhotos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📸 Shop Photos ({worker.media.shopPhotos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopPhotosContainer}>
              {worker.media.shopPhotos.map((photo, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedPhoto(photo)}>
                  <Image 
                    source={{ uri: photo }} 
                    style={styles.shopPhoto}
                  />
                </TouchableOpacity>
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
              <Text style={styles.videoText}>Introductory Video</Text>
            </View>
          </View>
        )}

        {/* JOINED DATE */}
        {worker?.createdAt && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Member Since</Text>
            <Text style={styles.value}>{new Date(worker.createdAt).toLocaleDateString()}</Text>
          </View>
        )}

        {/* CONTACT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contact & Book</Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Call {worker?.userId?.phoneNumber || "Worker"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactButton, styles.messageButton]} onPress={handleSendMessage}>
            <Ionicons name="chatbubble" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        {/* NEGOTIATION AMOUNT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Negotiation Amount</Text>
          {parsedNegotiationAmount && parsedNegotiationAmount !== '' && parsedNegotiationAmount !== 'null' && !isNaN(parseFloat(parsedNegotiationAmount)) ? (
            <View style={styles.negotiationAmountBox}>
              <View style={styles.amountIconContainer}>
                <Text style={styles.amountIcon}>💵</Text>
              </View>
              <View style={styles.amountTextContainer}>
                <Text style={styles.amountLabel}>Quoted Amount</Text>
                <Text style={styles.amountValue}>
                  ₹{parseFloat(parsedNegotiationAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.amountUnavailableBox}>
              <Text style={styles.amountUnavailableText}>Not available</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FULL-SIZE PHOTO MODAL */}
      <Modal
        visible={!!selectedPhoto}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <Image
            source={{ uri: selectedPhoto }}
            style={styles.fullScreenPhoto}
            resizeMode="contain"
          />
        </View>
      </Modal>
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
    gap: 14,
  },

  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003f87",
  },

  photoContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingTop: 28,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  profilePhoto: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 5,
    borderColor: "#003f87",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  infoSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 26,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 14,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  location: {
    fontSize: 15,
    color: "#666",
    lineHeight: 20,
  },

  section: {
    backgroundColor: "#fff",
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
    letterSpacing: 0.3,
  },


  statusBadge: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
  },

  availableBadge: {
    backgroundColor: "#e8f5e9",
  },

  busyBadge: {
    backgroundColor: "#ffebee",
  },

  verifiedBadge: {
    backgroundColor: "#e8f5e9",
  },

  unverifiedBadge: {
    backgroundColor: "#fff3e0",
  },

  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  skillTag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#003f87",
  },

  skillText: {
    color: "#003f87",
    fontSize: 14,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    fontSize: 15,
    color: "#666",
  },

  value: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },
  negotiationAmountBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: '#003f87',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#003f87',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },

  amountIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#003f87',
  },

  amountIcon: {
    fontSize: 32,
  },

  amountTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  amountLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  amountValue: {
    fontSize: 28,
    color: '#003f87',
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  amountUnavailableBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },

  amountUnavailableText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '600',
  },
  bio: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  shopPhotosContainer: {
    marginVertical: 8,
  },

  shopPhoto: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 14,
  },

  videoPlaceholder: {
    height: 220,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  videoText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },

  contactButton: {
    backgroundColor: "#003f87",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  messageButton: {
    backgroundColor: "#0055d4",
  },

  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreenPhoto: {
    width: "80%",
    height: "80%",
  },

  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 50,
  },
});
