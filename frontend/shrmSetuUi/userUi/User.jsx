import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
  { name: "Painting", count: "156 jobs", icon: "🎨" },
  { name: "Demolition", count: "98 jobs", icon: "🏗" },
];

const quickActions = [
  { label: "Complete Profile", icon: "person-add", color: "#e3f2fd" },
  { label: "Browse Jobs", icon: "briefcase", color: "#f3e5f5" },
  { label: "View Skills", icon: "star", color: "#fce4ec" },
];

export default function UserFlow() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    // Navigate based on tab
    if (tab === "search") {
      router.push("screens/search");
    } else if (tab === "profile") {
      router.push("screens/profile");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* TOP SPACING */}
        <View style={{ height: 20 }} />

        {/* HEADER */}
        <View style={styles.header}>
        <View style={{ width: 24 }} />
          <Text style={styles.logo}>SkillMatch</Text>
          <Ionicons name="person-circle" size={32} color="#003f87" />
        </View>

        {/* EXTRA GAP AFTER HEADER */}
        <View style={{ height: 16 }} />

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
          <Text style={styles.sectionTitle}>⚡ Electrician</Text>
          <TouchableOpacity onPress={() => router.push("screens/all-electrician")}>
            <Text style={styles.viewAll}>View All ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {jobCategories.electrician.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.cardImg} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardLocationPrice}>
                  <Ionicons name="location" size={14} color="#999" />
                  <Text style={styles.cardSub}>{item.location}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Ionicons name="star" size={12} color="#ffc107" />
                  <Text style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>{item.rating}</Text>
                </View>
                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* PLUMBER JOBS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔧 Plumber</Text>
          <TouchableOpacity onPress={() => router.push("screens/all-plumber")}>
            <Text style={styles.viewAll}>View All ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {jobCategories.plumber.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.cardImg} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardLocationPrice}>
                  <Ionicons name="location" size={14} color="#999" />
                  <Text style={styles.cardSub}>{item.location}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Ionicons name="star" size={12} color="#ffc107" />
                  <Text style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>{item.rating}</Text>
                </View>
                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* PAINTER JOBS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎨 Painter</Text>
          <TouchableOpacity onPress={() => router.push("screens/all-painter")}>
            <Text style={styles.viewAll}>View All ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {jobCategories.painter.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.cardImg} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardLocationPrice}>
                  <Ionicons name="location" size={14} color="#999" />
                  <Text style={styles.cardSub}>{item.location}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Ionicons name="star" size={12} color="#ffc107" />
                  <Text style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>{item.rating}</Text>
                </View>
                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* CARPENTER JOBS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🪵 Carpenter</Text>
          <TouchableOpacity onPress={() => router.push("screens/all-carpenter")}>
            <Text style={styles.viewAll}>View All ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {jobCategories.carpenter.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.cardImg} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardLocationPrice}>
                  <Ionicons name="location" size={14} color="#999" />
                  <Text style={styles.cardSub}>{item.location}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Ionicons name="star" size={12} color="#ffc107" />
                  <Text style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>{item.rating}</Text>
                </View>
                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.subSectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={[styles.quickActionCard, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={28} color="#003f87" />
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TRENDING CATEGORIES */}
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Categories</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All ›</Text>
            </TouchableOpacity>
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

        {/* STATS SECTION */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Verified Workers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹1.2L</Text>
            <Text style={styles.statLabel}>Avg Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8★</Text>
            <Text style={styles.statLabel}>User Rating</Text>
          </View>
        </View>

        {/* CTA BANNER */}
        <View style={styles.ctaBanner}>
          <Ionicons name="flash" size={32} color="#ffc107" />
          <Text style={styles.ctaTitle}>Limited Time Offer</Text>
          <Text style={styles.ctaDesc}>Get 20% bonus on first 5 jobs applied</Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Claim Bonus</Text>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#003f87",
  },

  bannerWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingTop: 24,
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
    marginTop: 8,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
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
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  cardImg: {
    height: 140,
    width: "100%",
    backgroundColor: "#f0f0f0",
  },

  cardContent: {
    padding: 14,
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
    marginBottom: 10,
  },

  cardSub: {
    color: "#888",
    fontSize: 12,
    marginLeft: 4,
  },

  applyBtn: {
    backgroundColor: "#003f87",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 2,
  },

  applyText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
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
    marginTop: 28,
  },

  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },

  categoryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  categoryName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#222",
  },

  categoryCount: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
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