import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "../../hooks/use-translation";

export default function Dashboard() {
  const t = useTranslation();

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.appName}>{t('common.app_name')}</Text>
        </View>

        {/* GREETING */}
        <View style={styles.section}>
          <Text style={styles.title}>Hello, Alex</Text>
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

        {/* RATINGS */}
        <View style={styles.section}>
          <View style={styles.ratingsHeader}>
            <Text style={styles.sectionTitle}>Your Ratings</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetails}>View Details</Text>
            </TouchableOpacity>
          </View>

          {/* Behavior */}
          <View style={[styles.ratingSection, styles.ratingBehavior]}>
            <View style={styles.ratingHeader}>
              <View style={styles.ratingIconGreen}>
                <Text style={styles.ratingEmoji}>😄</Text>
              </View>
              <View style={styles.ratingHeaderInfo}>
                <Text style={styles.ratingTitle}>Behavior</Text>
                <View style={styles.badgeGreen}>
                  <Text style={styles.badgeText}>EXCELLENT</Text>
                </View>
              </View>
              <View style={styles.ratingScoreBox}>
                <Text style={styles.ratingScoreGreen}>5.0</Text>
                <Text style={styles.ratingMax}>/ 5</Text>
              </View>
            </View>

            <View style={styles.ratingDivider} />

            <View style={styles.ratingMetricSection}>
              <View style={styles.metricHeaderRow}>
                <Text style={styles.metricLabel}>POLITENESS</Text>
                <Text style={styles.metricValue}>100%</Text>
              </View>
              <View style={styles.metricBar}>
                <View style={[styles.metricFill, { width: "100%", backgroundColor: "#228B22" }]} />
              </View>
              <Text style={styles.metricText}>Customers say you are very respectful and arrive on time. Keep it up!</Text>
            </View>
          </View>

          {/* Work Quality */}
          <View style={[styles.ratingSection, styles.ratingQuality]}>
            <View style={styles.ratingHeader}>
              <View style={styles.ratingIconGray}>
                <Text style={styles.ratingEmoji}>😐</Text>
              </View>
              <View style={styles.ratingHeaderInfo}>
                <Text style={styles.ratingTitle}>Work Quality</Text>
                <View style={styles.badgeGray}>
                  <Text style={styles.badgeText}>STABLE</Text>
                </View>
              </View>
              <View style={styles.ratingScoreBox}>
                <Text style={styles.ratingScoreGray}>3.8</Text>
                <Text style={styles.ratingMax}>/ 5</Text>
              </View>
            </View>

            <View style={styles.ratingDivider} />

            <View style={styles.ratingMetricSection}>
              <View style={styles.metricHeaderRow}>
                <Text style={styles.metricLabel}>ACCURACY</Text>
                <Text style={styles.metricValue}>76%</Text>
              </View>
              <View style={styles.metricBar}>
                <View style={[styles.metricFill, { width: "76%", backgroundColor: "#666" }]} />
              </View>
              <Text style={styles.metricText}>Your work is consistent, but a few customers mentioned detail-oriented cleanup.</Text>
            </View>
          </View>

          {/* Happiness */}
          <View style={[styles.ratingSection, styles.ratingHappiness]}>
            <View style={styles.ratingHeader}>
              <View style={styles.ratingIconRed}>
                <Text style={styles.ratingEmoji}>😞</Text>
              </View>
              <View style={styles.ratingHeaderInfo}>
                <Text style={styles.ratingTitle}>Happiness</Text>
                <View style={styles.badgeRed}>
                  <Text style={styles.badgeText}>NEEDS CARE</Text>
                </View>
              </View>
              <View style={styles.ratingScoreBox}>
                <Text style={styles.ratingScoreRed}>2.1</Text>
                <Text style={styles.ratingMax}>/ 5</Text>
              </View>
            </View>

            <View style={styles.ratingDivider} />

            <View style={styles.ratingMetricSection}>
              <View style={styles.metricHeaderRow}>
                <Text style={styles.metricLabel}>SERVICE JOY</Text>
                <Text style={styles.metricValue}>42%</Text>
              </View>
              <View style={styles.metricBar}>
                <View style={[styles.metricFill, { width: "42%", backgroundColor: "#d32f2f" }]} />
              </View>
              <Text style={styles.metricText}>Some users found the speed of service slightly slow this week. Try to update them more often!</Text>
            </View>
          </View>
        </View>

        {/* QUICK GUIDE */}
        <View style={styles.section}>
          <View style={styles.quickGuideBox}>
            <Text style={styles.quickGuideTitle}>Quick Guide</Text>
            <View style={styles.quickGuideItems}>
              <View style={styles.quickGuideItem}>
                <Text style={styles.quickGuideEmoji}>😞</Text>
                <Text style={styles.quickGuideLabel}>POOR</Text>
              </View>
              <View style={styles.quickGuideItem}>
                <Text style={styles.quickGuideEmoji}>😐</Text>
                <Text style={styles.quickGuideLabel}>OK</Text>
              </View>
              <View style={styles.quickGuideItem}>
                <Text style={styles.quickGuideEmoji}>😄</Text>
                <Text style={styles.quickGuideLabel}>GOOD</Text>
              </View>
            </View>
            <Text style={styles.quickGuideDescription}>
              Colors and faces help you see how you are doing at a glance!
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
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

  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
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
});