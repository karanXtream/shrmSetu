import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/$/, '');

// Helper function to fetch with timeout
const fetchWithTimeout = async (url, timeout = 12000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const jobCategories = {
  electrician: [
    {
      title: "Electrician - House Wiring",
      location: "Gurgaon, HR",
      img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=150&fit=crop",
      rating: 4.8,
    },
    {
      title: "Electrical Repairs",
      location: "Delhi, DL",
      img: "https://images.unsplash.com/photo-1581092162562-40038f56c236?w=300&h=150&fit=crop",
      rating: 4.7,
    },
  ],
  plumber: [
    {
      title: "Plumber - Pipes & Fittings",
      location: "Mumbai, MH",
      img: "https://images.unsplash.com/photo-1585604201195-e97b96f1a205?w=300&h=150&fit=crop",
      rating: 4.9,
    },
    {
      title: "Water Tank Installation",
      location: "Bangalore, KA",
      img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=150&fit=crop",
      rating: 4.6,
    },
  ],
  painter: [
    {
      title: "House Painting",
      location: "Pune, MH",
      img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=150&fit=crop",
      rating: 4.8,
    },
    {
      title: "Wall Painting & Texture",
      location: "Hyderabad, TG",
      img: "https://images.unsplash.com/photo-1581092162562-40038f56c236?w=300&h=150&fit=crop",
      rating: 4.7,
    },
  ],
  carpenter: [
    {
      title: "Carpenter - Doors & Windows",
      location: "Chennai, TN",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=150&fit=crop",
      rating: 4.9,
    },
    {
      title: "Furniture Assembly",
      location: "Jaipur, RJ",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop",
      rating: 4.5,
    },
  ],
};

const trendingCategories = [
  { name: "Plumbing", count: "234 jobs", icon: "🔧" },
  { name: "Carpentry", count: "189 jobs", icon: "🪵" },
];

const quickActions = [];

// Helper function to truncate text
const truncateText = (text, maxLength = 40) => {
  if (!text) return "";
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "..";
  }
  return text;
};

export default function UserFlow() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const cacheRef = useRef(null);
  const pageRef = useRef(0);
  const abortControllerRef = useRef(null);

  const ITEMS_PER_PAGE = 10;
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  // Load cache and fetch first batch
  useEffect(() => {
    loadUsers(true);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadUsers = async (isInitial = false) => {
    // Check cache first for initial load
    if (isInitial && cacheRef.current && Date.now() - cacheRef.current.timestamp < CACHE_TIME) {
      setUsers(cacheRef.current.data.slice(0, ITEMS_PER_PAGE));
      pageRef.current = 0;
      setPage(0);
      setHasMore(cacheRef.current.data.length > ITEMS_PER_PAGE);
      setLoading(false);
      return;
    }

    if (isInitial) {
      setLoading(true);
      pageRef.current = 0;
      setPage(0);
    } else {
      setLoadingMore(true);
    }

    try {
      abortControllerRef.current = new AbortController();
      const skipValue = isInitial ? 0 : (pageRef.current + 1) * ITEMS_PER_PAGE;
      const response = await fetchWithTimeout(
        `${API_URL}/api/workers?skip=${skipValue}&limit=${ITEMS_PER_PAGE}`,
        12000
      );
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        if (isInitial) {
          // Store all data in cache for future pagination
          const allWorkers = data.data;
          cacheRef.current = { data: allWorkers, timestamp: Date.now() };
          setUsers(allWorkers.slice(0, ITEMS_PER_PAGE));
          setHasMore(allWorkers.length > ITEMS_PER_PAGE);
          pageRef.current = 0;
          setPage(0);
        } else {
          const newPage = pageRef.current + 1;
          pageRef.current = newPage;
          setPage(newPage);
          
          if (cacheRef.current && cacheRef.current.data) {
            const startIdx = newPage * ITEMS_PER_PAGE;
            const endIdx = (newPage + 1) * ITEMS_PER_PAGE;
            const moreUsers = cacheRef.current.data.slice(startIdx, endIdx);
            
            setUsers(prev => [...prev, ...moreUsers]);
            setHasMore(moreUsers.length === ITEMS_PER_PAGE);
          } else {
            setHasMore(data.data.length === ITEMS_PER_PAGE);
          }
        }
        console.log("Fetched workers batch:", data.data.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching users:', error);
      }
      if (isInitial) setUsers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      loadUsers(false);
    }
  };

  const handleExitApp = () => {
    BackHandler.exitApp();
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    // Navigate based on tab
    if (tab === "post") {
      router.replace("/screens/post");
    } else if (tab === "search") {
      router.replace("/screens/search");
    } else if (tab === "profile") {
      router.replace("/screens/profile");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* TOP SPACING */}
        <View style={{ height: 20 }} />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExitApp}>
            <Ionicons name="arrow-back" size={24} color="#003f87" />
          </TouchableOpacity>
          <Text style={styles.logo}>shrmSetu</Text>
        </View>

        {/* EXTRA GAP AFTER HEADER */}
        <View style={{ height: 32 }} />

        {/* INSPIRATION BANNER */}
        <View style={styles.bannerWrapper}>
          <ImageBackground
            source={require("../../assets/images/uiPhotos/labour_banner.png")}
            style={styles.inspirationBanner}
            imageStyle={styles.bannerImage}
          >
            <View style={styles.bannerOverlay} />
            <Text style={styles.inspirationTitle}>
              आपका समर्पण{"\n"}राष्ट्र को बनाता है।
            </Text>
            <View style={styles.quoteContainer}>
              <View style={styles.quoteBorder} />
              <Text style={styles.inspirationQuote}>
                "मेहनत ही कामयाबी की कुंजी है"
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* ELECTRICIAN JOBS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👥 All Workers ({users.length})</Text>
        </View>

        {loading ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#003f87" />
          </View>
        ) : users.length > 0 ? (
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <FlatList
              scrollEnabled={false}
              data={users}
              numColumns={2}
              columnWrapperStyle={{ gap: 16, marginBottom: 20 }}
              keyExtractor={(item) => item._id}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                loadingMore ? (
                  <View style={{ alignItems: "center", paddingVertical: 20, width: '100%' }}>
                    <ActivityIndicator size="small" color="#003f87" />
                  </View>
                ) : null
              }
              renderItem={({ item: worker }) => {
                const firstSkill = worker?.skills?.[0] || "Worker";
                const fallbackAvatar = `https://ui-avatars.com/api/?name=${firstSkill}&background=random&color=fff&bold=true&size=400`;
                const profilePhoto = worker?.media?.profilePhoto || fallbackAvatar;
                return (
                  <View style={[styles.card, { flex: 1 }]}>
                    <Image 
                      source={{ uri: profilePhoto }} 
                      style={styles.cardImg}
                      onError={(e) => console.log("Image error:", e.nativeEvent.error)}
                      onLoad={() => console.log("Image loaded successfully")}
                    />
                    <View style={styles.cardContent}>
                      <View style={styles.cardLocationPrice}>
                        <Ionicons name="hammer-outline" size={14} color="#999" />
                        <Text style={styles.cardSub} numberOfLines={1}>
                          {truncateText(worker?.skills?.join(", ") || "No skills", 35)}
                        </Text>
                      </View>
                      <View style={styles.cardLocationPrice}>
                        <Ionicons name="location" size={14} color="#999" />
                        <Text style={styles.cardSub} numberOfLines={1}>
                          {worker?.userId?.location?.city || ""}{worker?.userId?.location?.city && worker?.userId?.location?.state ? ", " : ""}{worker?.userId?.location?.state || ""}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.applyBtn}
                        onPress={() => {
                          console.log("Navigating to worker profile with ID:", worker.userId?._id || worker._id);
                          router.push({
                            pathname: "/screens/worker-profile",
                            params: { workerId: worker.userId?._id || worker._id }
                          });
                        }}
                      >
                        <Text style={styles.applyText}>View Profile</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: "#999" }}>No workers available</Text>
          </View>
        )}

        {/* TRENDING CATEGORIES */}
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Skills</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {trendingCategories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* BOTTOM TABS NAVIGATION */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navItemContainer}
          onPress={() => handleTabPress("home")}
        >
          <Ionicons
            name="home"
            size={24}
            color={activeTab === "home" ? "#003f87" : "#999"}
          />
          <Text style={[styles.navLabel, activeTab === "home" && styles.navLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItemContainer}
          onPress={() => handleTabPress("post")}
        >
          <Ionicons
            name="add-circle"
            size={24}
            color={activeTab === "post" ? "#003f87" : "#999"}
          />
          <Text style={[styles.navLabel, activeTab === "post" && styles.navLabelActive]}>
            Post
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItemContainer}
          onPress={() => handleTabPress("search")}
        >
          <Ionicons
            name="search"
            size={24}
            color={activeTab === "search" ? "#003f87" : "#999"}
          />
          <Text style={[styles.navLabel, activeTab === "search" && styles.navLabelActive]}>
            Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItemContainer}
          onPress={() => handleTabPress("profile")}
        >
          <Ionicons
            name="person"
            size={24}
            color={activeTab === "profile" ? "#003f87" : "#999"}
          />
          <Text style={[styles.navLabel, activeTab === "profile" && styles.navLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
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

  bannerWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 28,
    paddingTop: 28,
  },

  banner: {
    padding: 24,
    backgroundColor: "#0055d4",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badge: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 6,
    letterSpacing: 0.8,
  },

  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    lineHeight: 26,
  },

  bannerDesc: {
    color: "#e8f0ff",
    fontSize: 13,
    marginBottom: 18,
    lineHeight: 20,
  },

  bannerBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  bannerBtnText: {
    color: "#0055d4",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },

  inspirationBanner: {
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },

  bannerImage: {
    borderRadius: 16,
    resizeMode: "cover",
  },

  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(26, 26, 46, 0.7)",
    borderRadius: 16,
  },

  inspirationBackgroundIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#0055d4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  inspirationTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 20,
    zIndex: 1,
  },

  quoteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    zIndex: 1,
  },

  quoteBorder: {
    width: 4,
    height: 40,
    backgroundColor: "#0055d4",
    borderRadius: 2,
    marginRight: 12,
  },

  inspirationQuote: {
    color: "#b0b8d4",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    flex: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 0,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.4,
  },

  viewAll: {
    fontSize: 14,
    color: "#0055d4",
    fontWeight: "600",
  },

  cardsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardImg: {
    height: 170,
    width: "100%",
    backgroundColor: "#f5f5f5",
  },

  cardContent: {
    padding: 20,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
  },

  cardLocationPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  cardSub: {
    color: "#888",
    fontSize: 13,
    marginLeft: 6,
    lineHeight: 19,
  },

  applyBtn: {
    backgroundColor: "#003f87",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },

  applyText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },

  quickActionsSection: {
    paddingHorizontal: 16,
    marginTop: 28,
    marginBottom: 20,
  },

  subSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  quickActionsContainer: {
    flexDirection: "row",
    gap: 12,
  },

  quickActionCard: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  quickActionLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },

  trendingSection: {
    paddingHorizontal: 16,
    marginTop: 52,
    marginBottom: 20,
  },

  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 0,
  },

  categoryCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  categoryIcon: {
    fontSize: 48,
    marginBottom: 14,
  },

  categoryName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },

  categoryCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },

  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 24,
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0055d4",
  },

  statLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 6,
    textAlign: "center",
  },

  ctaBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "#003f87",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  ctaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    marginBottom: 6,
  },

  ctaDesc: {
    fontSize: 12,
    color: "#e8f0ff",
    textAlign: "center",
    marginBottom: 14,
  },

  ctaButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  ctaButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },

  nav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 5,
  },

  navItemContainer: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  navLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    fontWeight: "500",
  },

  navLabelActive: {
    color: "#003f87",
    fontWeight: "bold",
  },
});