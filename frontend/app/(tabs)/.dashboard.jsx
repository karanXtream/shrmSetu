import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Card, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/providers/RootProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [userName, setUserName] = useState('Worker');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalEarnings: 0,
    completedJobs: 0,
    rating: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get user name from auth context or AsyncStorage
        if (user?.fullName) {
          setUserName(user.fullName);
        } else {
          const userJson = await AsyncStorage.getItem('userData');
          if (userJson) {
            const userData = JSON.parse(userJson);
            setUserName(userData.fullName || userData.name || 'Worker');
          }
        }

        // TODO: Fetch actual stats from API
        // For now, set default values
        setStats({
          totalPosts: 0,
          totalEarnings: 0,
          completedJobs: 0,
          rating: 0,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003f87" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER GRADIENT */}
        <LinearGradient
          colors={['#003f87', '#0052cc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="dashboard" size={32} color="#fff" />
          </View>
        </LinearGradient>

        {/* STATS CARDS */}
        <View style={styles.statsContainer}>
          {/* Total Posts */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="document" size={24} color="#003f87" />
            </View>
            <Text style={styles.statValue}>{stats.totalPosts}</Text>
            <Text style={styles.statLabel}>Total Posts</Text>
          </View>

          {/* Completed Jobs */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{stats.completedJobs}</Text>
            <Text style={styles.statLabel}>Completed Jobs</Text>
          </View>

          {/* Total Earnings */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="cash" size={24} color="#ffc107" />
            </View>
            <Text style={styles.statValue}>₹{stats.totalEarnings}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>

          {/* Rating */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="star" size={24} color="#ffc107" />
            </View>
            <Text style={styles.statValue}>{stats.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            {/* Find Jobs */}
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="briefcase" size={28} color="#003f87" />
              </View>
              <Text style={styles.actionLabel}>Find Jobs</Text>
              <Text style={styles.actionSubtext}>Browse opportunities</Text>
            </TouchableOpacity>

            {/* My Jobs */}
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="list" size={28} color="#10b981" />
              </View>
              <Text style={styles.actionLabel}>My Jobs</Text>
              <Text style={styles.actionSubtext}>Active & pending</Text>
            </TouchableOpacity>

            {/* Earnings */}
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="wallet" size={28} color="#ffc107" />
              </View>
              <Text style={styles.actionLabel}>Earnings</Text>
              <Text style={styles.actionSubtext}>View income</Text>
            </TouchableOpacity>

            {/* Messages */}
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#fecaca' }]}>
                <Ionicons name="mail" size={28} color="#ef4444" />
              </View>
              <Text style={styles.actionLabel}>Messages</Text>
              <Text style={styles.actionSubtext}>3 unread</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New job posted</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>

          <View style={styles.activityCard}>
            <View style={[styles.activityDot, { backgroundColor: '#10b981' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Job completed</Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>

          <View style={styles.activityCard}>
            <View style={[styles.activityDot, { backgroundColor: '#ffc107' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New message received</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },

  // HEADER
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 44,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerContent: {
    flex: 1,
  },

  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },

  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },

  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // STATS
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 10,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#003f87',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },

  // SECTIONS
  section: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },

  viewAll: {
    fontSize: 13,
    color: '#003f87',
    fontWeight: '600',
  },

  // QUICK ACTIONS
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },

  actionSubtext: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },

  // ACTIVITY
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#003f87',
    marginRight: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },

  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});
