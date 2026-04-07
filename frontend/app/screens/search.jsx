import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';

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

export default function SearchScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({ skill: null, city: null });
  
  const cacheRef = useRef(null);
  const pageRef = useRef(0);
  const debounceRef = useRef(null);
  const abortControllerRef = useRef(null);

  const ITEMS_PER_PAGE = 10;
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  // Load cache and fetch first batch
  useEffect(() => {
    loadWorkers(true);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const loadWorkers = async (isInitial = false) => {
    // Check cache first for initial load
    if (isInitial && cacheRef.current && Date.now() - cacheRef.current.timestamp < CACHE_TIME) {
      setWorkers(cacheRef.current.data.slice(0, ITEMS_PER_PAGE));
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
          setWorkers(allWorkers.slice(0, ITEMS_PER_PAGE));
          setFilteredWorkers(allWorkers.slice(0, ITEMS_PER_PAGE));
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
            const moreWorkers = cacheRef.current.data.slice(startIdx, endIdx);
            
            setWorkers(prev => [...prev, ...moreWorkers]);
            setFilteredWorkers(prev => [...prev, ...moreWorkers]);
            setHasMore(moreWorkers.length === ITEMS_PER_PAGE);
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
        console.error('Error fetching workers:', error);
      }
      if (isInitial) setWorkers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      loadWorkers(false);
    }
  };

  // Debounced filter effect - only runs after user stops typing for 300ms
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const filtered = workers.filter((worker) => {
        const query = searchQuery.trim().toLowerCase();
        const skills = worker?.skills?.map(s => s.toLowerCase()) || [];
        const city = worker?.userId?.location?.city?.toLowerCase() || '';
        const state = worker?.userId?.location?.state?.toLowerCase() || '';
        const name = worker?.userId?.fullName?.toLowerCase() || '';
        
        // Search text filter
        const matchesSearch = !query || 
          skills.some(skill => skill.includes(query)) ||
          city.includes(query) ||
          state.includes(query) ||
          name.includes(query);

        // Skill filter
        const matchesSkill = !selectedFilters.skill || 
          skills.some(skill => skill.includes(selectedFilters.skill.toLowerCase()));

        // City filter
        const matchesCity = !selectedFilters.city || 
          city.includes(selectedFilters.city.toLowerCase()) ||
          state.includes(selectedFilters.city.toLowerCase());

        return matchesSearch && matchesSkill && matchesCity;
      });

      setFilteredWorkers(filtered);
    }, 300); // 300ms debounce delay

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, workers, selectedFilters]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      router.replace('/screens/user-hire');
    } else if (tab === 'post') {
      router.replace('/screens/post');
    } else if (tab === 'profile') {
      router.replace('/screens/profile');
    }
  };

  const truncateText = (text, maxLength = 40) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..";
    }
    return text;
  };

  // Get unique skills and cities for filter suggestions
  const allSkills = [...new Set(workers.flatMap(w => w?.skills || []))].sort();
  const allCities = [...new Set(workers.map(w => w?.userId?.location?.city).filter(Boolean))].sort();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Search Workers</Text>
            <Text style={styles.headerSubtitle}>Find by skill, city, or name</Text>
          </View>

          {/* SEARCH BOX */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search skills or city..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* FILTER CHIPS */}
          {!loading && (
            <>
              {/* SKILL FILTERS */}
              {allSkills.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Skills</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsContainer}>
                    {allSkills.slice(0, 8).map((skill, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.filterChip,
                          selectedFilters.skill === skill && styles.filterChipActive
                        ]}
                        onPress={() => setSelectedFilters({
                          ...selectedFilters,
                          skill: selectedFilters.skill === skill ? null : skill
                        })}
                      >
                        <Text style={[
                          styles.filterChipText,
                          selectedFilters.skill === skill && styles.filterChipTextActive
                        ]}>
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* CITY FILTERS */}
              {allCities.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Cities</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsContainer}>
                    {allCities.slice(0, 8).map((city, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.filterChip,
                          selectedFilters.city === city && styles.filterChipActive
                        ]}
                        onPress={() => setSelectedFilters({
                          ...selectedFilters,
                          city: selectedFilters.city === city ? null : city
                        })}
                      >
                        <Text style={[
                          styles.filterChipText,
                          selectedFilters.city === city && styles.filterChipTextActive
                        ]}>
                          {city}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {/* RESULTS */}
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <ActivityIndicator size="large" color="#003f87" />
              <Text style={{ marginTop: 12, color: '#999' }}>Loading workers...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultCount}>{filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''} found</Text>

              {filteredWorkers.length > 0 ? (
                <View style={{ paddingHorizontal: 0, marginTop: 12 }}>
                  <FlatList
                    scrollEnabled={false}
                    data={filteredWorkers}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 16, paddingHorizontal: 16, marginBottom: 20 }}
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
                        <View style={[styles.workerCard, { flex: 1 }]}>
                          <Image 
                            source={{ uri: profilePhoto }} 
                            style={styles.workerImage}
                          />
                          <View style={styles.workerContent}>
                            <Text style={styles.workerName} numberOfLines={1}>
                              {worker?.userId?.fullName || "Worker"}
                            </Text>
                            <View style={styles.skillRow}>
                              <Ionicons name="hammer-outline" size={12} color="#999" />
                              <Text style={styles.skillText} numberOfLines={1}>
                                {truncateText(worker?.skills?.join(", ") || "No skills", 28)}
                              </Text>
                            </View>
                            <View style={styles.locationRow}>
                              <Ionicons name="location" size={12} color="#999" />
                              <Text style={styles.cityText} numberOfLines={1}>
                                {worker?.userId?.location?.city || ""}{worker?.userId?.location?.city && worker?.userId?.location?.state ? ", " : ""}{worker?.userId?.location?.state || ""}
                              </Text>
                            </View>
                            <TouchableOpacity 
                              style={styles.viewBtn}
                              onPress={() => {
                                router.push({
                                  pathname: "/screens/worker-profile",
                                  params: { workerId: worker.userId?._id || worker._id }
                                });
                              }}
                            >
                              <Text style={styles.viewBtnText}>View</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={48} color="#cbd5e1" />
                  <Text style={styles.emptyTitle}>No workers found</Text>
                  <Text style={styles.emptySubtitle}>Try different keywords or filters</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* BOTTOM TABS */}
        <View style={styles.nav}>
          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('home')}>
            <Ionicons name="home" size={24} color="#999" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('post')}>
            <Ionicons name="add-circle" size={24} color="#999" />
            <Text style={styles.navLabel}>Post</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('search')}>
            <Ionicons name="search" size={24} color="#003f87" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItemContainer} onPress={() => handleTabPress('profile')}>
            <Ionicons name="person" size={24} color="#999" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#dbe3ef',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginHorizontal: 16,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    paddingVertical: 2,
  },
  filterSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  filterChipsContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d4d9e3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#003f87',
    borderColor: '#003f87',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  workerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  workerImage: {
    height: 160,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  workerContent: {
    padding: 16,
  },
  workerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  skillText: {
    fontSize: 12,
    color: '#888',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  cityText: {
    fontSize: 12,
    color: '#888',
  },
  viewBtn: {
    backgroundColor: '#003f87',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
  },
  nav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 5,
  },
  navItemContainer: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  navLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#003f87',
    fontWeight: '700',
  },
});
