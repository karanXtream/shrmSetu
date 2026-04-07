import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "../../hooks/use-translation";
import * as postService from "../../services/postService";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const t = useTranslation();
  const screenWidth = Dimensions.get('window').width;
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Load user name
    loadUserName();
    
    fetchAllPosts();

    return () => backHandler.remove();
  }, []);

  const loadUserName = async () => {
    try {
      const userJson = await AsyncStorage.getItem('userData');
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUserName(userData.fullName || userData.name || 'User');
      }
    } catch (error) {
      console.error('Error loading user name:', error);
      setUserName('User');
    }
  };

  const fetchAllPosts = async () => {
    try {
      setPostsLoading(true);
      console.log('Fetching all posts...');
      const response = await postService.getAllPosts({ limit: 20 });
      console.log('Posts response:', response);
      
      if (response?.data) {
        const postsList = response.data.data || response.data;
        setPosts(Array.isArray(postsList) ? postsList : []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleJobPress = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.appName}>{t('common.app_name')}</Text>
        </View>

        {/* GREETING */}
        <View style={styles.section}>
          <Text style={styles.title}>Hello, {userName}</Text>
          <Text style={styles.subtitle}>
            Here is your progress for this month.
          </Text>
        </View>

        {/* HERO CARD */}
        <LinearGradient
          colors={["#0040a1", "#0056d2"]}
          style={styles.heroCard}
        >
          {/* SVG Background */}
          <View style={styles.heroCardBackground}>
            <Text style={styles.heroCardBgSvg}>
              🔧
            </Text>
          </View>
          
          <View style={styles.heroHeader}>
            <View style={styles.heroIconBox}>
              <Ionicons name="hammer" size={24} color="#fff" />
            </View>
            <Text style={styles.heroLabel}>TOTAL WORK DONE</Text>
          </View>
          <View style={styles.heroValueContainer}>
            <Text style={styles.heroValue}>124</Text>
            <Text style={styles.heroSub}>tasks</Text>
          </View>
          <View style={styles.heroBadge}>
            <Ionicons name="trending-up" size={14} color="#fff" />
            <Text style={styles.heroBadgeText}>+12% from last month</Text>
          </View>
        </LinearGradient>
        
        {/* POSTED JOBS SECTION */}
        <View style={styles.jobsSection}>
          <View style={styles.jobsSectionHeader}>
            <Text style={styles.jobsSectionTitle}>Available Jobs</Text>
            <TouchableOpacity onPress={fetchAllPosts}>
              <Text style={styles.refreshButton}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {postsLoading ? (
            <View style={styles.loadingJobsContainer}>
              <ActivityIndicator size="small" color="#003f87" />
              <Text style={styles.loadingJobsText}>Loading jobs...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyJobsContainer}>
              <Ionicons name="briefcase-outline" size={32} color="#999" />
              <Text style={styles.emptyJobsText}>No jobs available</Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.jobCard}
                  onPress={() => handleJobPress(item)}
                  activeOpacity={0.7}
                >
                  {/* WORK PHOTO */}
                  {item.workPhotos && item.workPhotos.length > 0 && item.workPhotos[0] ? (
                    <View style={styles.jobPhotoContainer}>
                      <Image
                        source={{ 
                          uri: item.workPhotos[0]
                        }}
                        style={styles.jobPhoto}
                        resizeMode="cover"
                        onError={(error) => console.log('Image load error:', error)}
                        onLoad={() => console.log('Image loaded successfully')}
                      />
                    </View>
                  ) : (
                    <View style={styles.jobPhotoPlaceholder}>
                      <Ionicons name="image-outline" size={40} color="#ccc" />
                      <Text style={styles.placeholderText}>No photo available</Text>
                    </View>
                  )}

                  <View style={styles.jobHeader}>
                    <View style={styles.jobTitleContainer}>
                      <Text style={styles.jobTitle} numberOfLines={2}>
                        {item.location?.city && item.location?.state ? `${item.location.city}, ${item.location.state}` : 'Job Post'}
                      </Text>
                      <Text style={styles.jobSubtitle} numberOfLines={1}>
                        {item.requiredSkills?.slice(0, 2).join(', ') || 'Various skills'}
                      </Text>
                    </View>
                    <View style={styles.jobBudget}>
                      <Text style={styles.budgetCurrency}>₹</Text>
                      <Text style={styles.budgetAmount}>{item.expectedPrice || '0'}</Text>
                    </View>
                  </View>

                  <View style={styles.jobDetails}>
                    {item.requiredSkills && item.requiredSkills.length > 0 && (
                      <View style={styles.skillsContainer}>
                        {item.requiredSkills.slice(0, 3).map((skill, index) => (
                          <View key={index} style={styles.skillTag}>
                            <Text style={styles.skillText}>{skill}</Text>
                          </View>
                        ))}
                        {item.requiredSkills.length > 3 && (
                          <View style={styles.skillTag}>
                            <Text style={styles.skillText}>+{item.requiredSkills.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>

                  <View style={styles.jobFooter}>
                    <View style={styles.amenitiesContainer}>
                      {item.amenities?.stayAvailable && (
                        <View style={styles.amenityBadge}>
                          <Ionicons name="home" size={12} color="#10b981" />
                          <Text style={styles.amenityText}>Stay</Text>
                        </View>
                      )}
                      {item.amenities?.foodAvailable && (
                        <View style={styles.amenityBadge}>
                          <Ionicons name="restaurant" size={12} color="#f59e0b" />
                          <Text style={styles.amenityText}>Food</Text>
                        </View>
                      )}
                      <View style={styles.amenityBadge}>
                        <Ionicons name="location" size={12} color="#ef4444" />
                        <Text style={styles.amenityText}>{item.location?.pin}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id || Math.random().toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.jobsListContent}
            />
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* JOB DETAILS MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.detailsModalContainer}>
          {/* MODAL HEADER */}
          <LinearGradient
            colors={["#003f87", "#0052cc"]}
            style={styles.detailsHeader}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.detailsTitle}>Job Details</Text>
            <View style={{ width: 28 }} />
          </LinearGradient>

          {selectedJob && (
            <View style={styles.detailsContent}>
              {/* JOB PHOTOS CAROUSEL */}
              {selectedJob.workPhotos && selectedJob.workPhotos.length > 0 ? (
                <View style={styles.photoCarousel}>
                  <FlatList
                    data={selectedJob.workPhotos}
                    renderItem={({ item }) => (
                      <View style={{ width: screenWidth - 32, height: 280, justifyContent: "center", alignItems: "center" }}>
                        <Image
                          source={{ 
                            uri: item
                          }}
                          style={styles.detailPhoto}
                          resizeMode="cover"
                          onError={(error) => console.log('Modal image error:', error, 'URI:', item)}
                          onLoad={() => console.log('Modal image loaded:', item?.substring(0, 50))}
                        />
                      </View>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToInterval={screenWidth - 32}
                    snapToAlignment="center"
                  />
                  <View style={styles.photoCount}>
                    <Text style={styles.photoCountText}>
                      {selectedJob.workPhotos.length} Photos
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.photoCarouselEmpty}>
                  <Ionicons name="image-outline" size={60} color="#ccc" />
                  <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>No photos available</Text>
                </View>
              )}

              {/* LOCATION & BUDGET */}
              <View style={styles.detailCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="location" size={20} color="#003f87" />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.cardTitle}>Location</Text>
                    <Text style={styles.cardValue}>
                      {selectedJob.location?.city}, {selectedJob.location?.state} - {selectedJob.location?.pin}
                    </Text>
                    {selectedJob.location?.address && (
                      <Text style={styles.cardSubValue}>{selectedJob.location.address}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* BUDGET */}
              <View style={styles.detailCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="cash" size={20} color="#10b981" />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.cardTitle}>Budget</Text>
                    <Text style={styles.cardValue}>₹{selectedJob.expectedPrice}</Text>
                  </View>
                </View>
              </View>

              {/* REQUIRED SKILLS */}
              <View style={styles.detailCard}>
                <Text style={styles.cardTitle}>Required Skills</Text>
                <View style={styles.skillsGrid}>
                  {selectedJob.requiredSkills && selectedJob.requiredSkills.map((skill, index) => (
                    <View key={index} style={styles.detailSkillTag}>
                      <Text style={styles.detailSkillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* AMENITIES */}
              <View style={styles.detailCard}>
                <Text style={styles.cardTitle}>Amenities</Text>
                <View style={styles.amenitiesGrid}>
                  <View style={[styles.amenityItem, selectedJob.amenities?.stayAvailable && styles.amenityActive]}>
                    <Ionicons name="home" size={24} color={selectedJob.amenities?.stayAvailable ? "#10b981" : "#ccc"} />
                    <Text style={styles.amenityItemText}>Stay</Text>
                  </View>
                  <View style={[styles.amenityItem, selectedJob.amenities?.foodAvailable && styles.amenityActive]}>
                    <Ionicons name="restaurant" size={24} color={selectedJob.amenities?.foodAvailable ? "#f59e0b" : "#ccc"} />
                    <Text style={styles.amenityItemText}>Food</Text>
                  </View>
                </View>
              </View>

              {/* DESCRIPTION */}
              {selectedJob.description && (
                <View style={styles.detailCard}>
                  <Text style={styles.cardTitle}>Description</Text>
                  <Text style={styles.descriptionText}>{selectedJob.description}</Text>
                </View>
              )}

              {/* APPLY BUTTON */}
              <TouchableOpacity style={styles.applyButtonLarge}>
                <Text style={styles.applyButtonLargeText}>Apply for this Job</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </View>
          )}
        </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 44,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#003f87",
  },

  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
  },

  heroCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: -8, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    position: "relative",
    overflow: "hidden",
  },

  heroCardBackground: {
    position: "absolute",
    top: 20,
    right: -30,
    width: 200,
    height: 200,
    opacity: 0.08,
    zIndex: 0,
  },

  heroCardBgSvg: {
    fontSize: 150,
  },

  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
    zIndex: 1,
  },

  heroIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  heroLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  heroValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
    position: "relative",
    zIndex: 1,
  },

  heroValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#fff",
    marginRight: 8,
  },

  heroSub: {
    color: "#fff",
    fontSize: 18,
    position: "relative",
    zIndex: 1,
  },

  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    position: "relative",
    zIndex: 1,
  },

  heroBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  ratingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  viewDetails: {
    color: "#003f87",
    fontSize: 12,
    fontWeight: "600",
  },

  ratingSection: {
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: -8, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 10,
  },

  ratingBehavior: {
    backgroundColor: "#f0f8f5",
    borderLeftWidth: 6,
    borderLeftColor: "#228B22",
  },

  ratingQuality: {
    backgroundColor: "#f5f5f5",
    borderLeftWidth: 6,
    borderLeftColor: "#999",
  },

  ratingHappiness: {
    backgroundColor: "#fef5f5",
    borderLeftWidth: 6,
    borderLeftColor: "#e53935",
  },

  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 0,
  },

  ratingHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },

  badgeGreen: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },

  badgeGray: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },

  badgeRed: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#228B22",
  },

  ratingScoreBox: {
    alignItems: "flex-end",
  },

  ratingDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    marginVertical: 12,
  },

  ratingMetricSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  metricHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  ratingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  metricLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#228B22",
  },

  ratingScoreGreen: {
    fontSize: 28,
    fontWeight: "700",
    color: "#228B22",
  },

  ratingScoreGray: {
    fontSize: 28,
    fontWeight: "700",
    color: "#666",
  },

  ratingScoreRed: {
    fontSize: 28,
    fontWeight: "700",
    color: "#d32f2f",
  },

  ratingMax: {
    fontSize: 11,
    color: "#999",
  },

  ratingIconGreen: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7cb342",
    justifyContent: "center",
    alignItems: "center",
  },

  ratingIconGray: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },

  ratingIconRed: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
  },

  ratingEmoji: {
    fontSize: 24,
  },

  metricValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },

  metricBar: {
    height: 8,
    backgroundColor: "#e8e8e8",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },

  metricFill: {
    height: "100%",
    borderRadius: 4,
  },

  metricText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  quickGuideBox: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: -8, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 10,
  },

  quickGuideTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },

  quickGuideItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },

  quickGuideItem: {
    alignItems: "center",
  },

  quickGuideEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },

  quickGuideLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },

  quickGuideDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },

  // JOB DETAILS MODAL STYLES
  detailsModalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  detailsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  closeButton: {
    padding: 4,
  },

  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  detailsContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  photoCarousel: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden",
    height: 280,
    backgroundColor: "#e8e8e8",
    width: "100%",
  },

  photoSlide: {
    width: "100%",
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },

  photoCarouselEmpty: {
    marginVertical: 16,
    borderRadius: 12,
    height: 280,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },

  detailPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  photoCount: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  photoCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#003f87",
    marginBottom: 8,
  },

  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },

  cardSubValue: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  detailSkillTag: {
    backgroundColor: "#e8f0f8",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  detailSkillText: {
    fontSize: 12,
    color: "#003f87",
    fontWeight: "600",
  },

  amenitiesGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },

  amenityItem: {
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    width: "45%",
  },

  amenityActive: {
    backgroundColor: "#e8f5e9",
  },

  amenityItemText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginTop: 6,
  },

  descriptionText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },

  jobPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "cover",
  },

  jobPhotoContainer: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    marginBottom: 0,
  },

  jobPhotoPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 0,
  },

  placeholderText: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },

  applyButtonLarge: {
    backgroundColor: "#003f87",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#003f87",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  applyButtonLargeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },

  // JOB CARDS SECTION STYLES
  jobsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },

  jobsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  jobsSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },

  refreshButton: {
    fontSize: 12,
    fontWeight: "600",
    color: "#003f87",
  },

  loadingJobsContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingJobsText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  },

  emptyJobsContainer: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyJobsText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },

  jobsListContent: {
    gap: 0,
  },

  jobCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },

  jobTitleContainer: {
    flex: 1,
    marginRight: 8,
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },

  jobSubtitle: {
    fontSize: 11,
    color: "#666",
  },

  jobBudget: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  budgetCurrency: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10b981",
  },

  budgetAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
    marginLeft: 2,
  },

  jobDetails: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  skillTag: {
    backgroundColor: "#e8f0f8",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  skillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#003f87",
  },

  jobFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  amenitiesContainer: {
    flexDirection: "row",
    gap: 8,
  },

  amenityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },

  amenityText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
});