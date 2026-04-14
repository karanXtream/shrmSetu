import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketService from "../../services/socketService";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || "").trim().replace(/\/$/, "");

export default function ChatsScreen() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");

  // Set up socket message listener when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 Chat screen focused - loading chats');
      
      // Reload worker's applications
      const loadApplications = async () => {
        try {
          const storedApplications = await AsyncStorage.getItem('workerApplications');
          const applications = storedApplications ? JSON.parse(storedApplications) : [];
          console.log('📋 Reloaded worker applications:', applications.length);
          setChats(prevChats => {
            // Only update if the new data is different or empty
            if (applications.length > 0) {
              return applications;
            }
            // Keep existing chats if no stored applications
            return prevChats.length > 0 ? prevChats : [];
          });
        } catch (e) {
          console.error('Error loading applications:', e);
        }
      };
      
      loadApplications();
      
      const unsubscribe = socketService.onMessage((message) => {
        console.log('💬 New application received from:', message.senderName, 'Amount:', message.negotiationAmount);
        
        // Add new chat or update existing one
        setChats((prevChats) => {
          const existingChatIndex = prevChats.findIndex(
            (c) => c.id === message.senderId
          );

          if (existingChatIndex > -1) {
            // Update existing chat
            const updatedChats = [...prevChats];
            updatedChats[existingChatIndex] = {
              ...updatedChats[existingChatIndex],
              lastMessage: message.message,
              timestamp: message.timestamp || new Date(),
              unread: (updatedChats[existingChatIndex].unread || 0) + 1,
              negotiationAmount: message.negotiationAmount || updatedChats[existingChatIndex].negotiationAmount,
            };
            return updatedChats;
          } else {
            // Create new chat
            const newChat = {
              id: message.senderId,
              name: message.senderName || 'Unknown',
              lastMessage: message.message,
              timestamp: message.timestamp || new Date(),
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(message.senderName || 'User')}&background=random&color=fff&bold=true`,
              unread: 1,
              negotiationAmount: message.negotiationAmount || null,
            };
            return [newChat, ...prevChats];
          }
        });
      });

      return () => {
        console.log('📱 Chat screen unfocused - keeping chats in memory');
        unsubscribe();
      };
    }, [])
  );

  useEffect(() => {
    const loadChats = async () => {
      try {
        console.log('📋 [LOAD] ========= START ==========');
        
        // Load user name
        const userJson = await AsyncStorage.getItem("userData");
        if (userJson) {
          const user = JSON.parse(userJson);
          setUserName(user.fullName || user.name || "User");
        }

        // Load worker's own applications (when they applied for jobs)
        console.log('📋 [LOAD] Reading workerApplications from AsyncStorage');
        const storedApplications = await AsyncStorage.getItem('workerApplications');
        console.log('📋 [LOAD] Raw stored value:', storedApplications ? 'EXISTS' : 'NULL');
        
        let applications = storedApplications ? JSON.parse(storedApplications) : [];
        console.log('📋 [LOAD] Parsed applications (before filter):', applications.length, 'items');
        applications.forEach((app, idx) => {
          console.log(`  📊 [${idx}]`, { id: app.id, name: app.name, negotiationAmount: app.negotiationAmount, type: typeof app.negotiationAmount });
        });
        
        // Clean: Remove any applications with null/undefined/empty amount
        const beforeCount = applications.length;
        applications = applications.filter(a => {
          const hasAmount = a.negotiationAmount !== null && 
                           a.negotiationAmount !== undefined && 
                           String(a.negotiationAmount).trim() !== '' &&
                           String(a.negotiationAmount) !== 'null' &&
                           String(a.negotiationAmount) !== 'undefined';
          console.log(`  🧹 [LOAD] Checking "${a.name}": amount="${a.negotiationAmount}" -> ${hasAmount ? 'KEEP' : 'REMOVE'}`);
          return hasAmount;
        });
        
        if (applications.length !== beforeCount) {
          console.log('🧹 [LOAD] Cleaned:', beforeCount, '→', applications.length);
          if (applications.length > 0) {
            await AsyncStorage.setItem('workerApplications', JSON.stringify(applications));
          } else {
            await AsyncStorage.removeItem('workerApplications');
          }
        }
        
        console.log('📋 [LOAD] Final applications:', applications.map(a => ({ name: a.name, amount: a.negotiationAmount })));
        console.log('📋 [LOAD] ========= END ==========');

        // Start with worker's applications
        setChats(applications);
      } catch (error) {
        console.error("Error loading chats:", error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  // Save chats to AsyncStorage whenever they change
  useEffect(() => {
    const saveChats = async () => {
      if (chats.length > 0) {
        try {
          await AsyncStorage.setItem('workerApplications', JSON.stringify(chats));
          console.log('💾 [AUTOSAVE] Saved', chats.length, 'chats to AsyncStorage');
        } catch (e) {
          console.error('Error autosaving chats:', e);
        }
      }
    };
    
    saveChats();
  }, [chats]);

  const formatTime = (date) => {
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Now';
    }

    const now = new Date();
    const diffInMinutes = Math.floor((now - dateObj) / 60000);

    if (diffInMinutes < 1) return "Now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return dateObj.toLocaleDateString();
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = async (chat) => {
    console.log('👤 [TRACE] Clicking on chat:', { id: chat.id, name: chat.name, fullChat: JSON.stringify(chat) });
    console.log('👤 [TRACE] Amount in chat object:', chat.negotiationAmount, 'Type:', typeof chat.negotiationAmount);
    
    const hasAmount = chat.negotiationAmount !== null && chat.negotiationAmount !== undefined && chat.negotiationAmount !== '';
    console.log('👤 [TRACE] hasAmount check:', { negotiationAmount: chat.negotiationAmount, hasAmount, boolCheck: Boolean(chat.negotiationAmount) });
    
    const amountToStore = hasAmount ? String(chat.negotiationAmount) : '';
    console.log('👤 [TRACE] Final amount to store:', { amountToStore, isEmptyString: amountToStore === '', isEmpty: !amountToStore });
    
    try {
      await AsyncStorage.setItem('tempNegotiationAmount', amountToStore);
      const verify = await AsyncStorage.getItem('tempNegotiationAmount');
      console.log('👤 [TRACE] Verified stored amount:', verify);
      
      // Wait to ensure storage is written
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('👤 [TRACE] Pushing to profile with params:', { workerId: chat.id, negotiationAmount: amountToStore });
      router.push({
        pathname: "/screens/worker-profile",
        params: {
          workerId: chat.id,
          negotiationAmount: amountToStore,
        },
      });
    } catch (e) {
      console.error('Error:', e);
      router.push({
        pathname: "/screens/worker-profile",
        params: {
          workerId: chat.id,
          negotiationAmount: amountToStore,
        },
      });
    }
  };

  const handleDeleteChat = async (chatId, chatName) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete chat with ${chatName}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const updatedChats = chats.filter(chat => chat.id !== chatId);
              setChats(updatedChats);
              await AsyncStorage.setItem('workerApplications', JSON.stringify(updatedChats));
              console.log('✅ Chat deleted:', chatName);
            } catch (e) {
              console.error('Error deleting chat:', e);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#003f87" />
        </TouchableOpacity>
        <Text style={styles.logo}>Chats</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* CHATS LIST */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#003f87" />
        </View>
      ) : filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.chatItem}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{item.name}</Text>
                  <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewProfileBtn}
                onPress={() => handleChatPress(item)}
              >
                <Text style={styles.viewProfileBtnText}>View Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteChat(item.id, item.name)}
              >
                <Ionicons name="trash" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubText}>Start a new conversation</Text>
        </View>
      )}
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
    paddingVertical: 16,
    paddingTop: 42,
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    gap: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },

  chatItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  chatContent: {
    flex: 1,
  },

  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  messageWrapper: {
    display: "none",
  },

  unreadBadge: {
    backgroundColor: "#003f87",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  unreadText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  viewProfileBtn: {
    backgroundColor: "#003f87",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },

  viewProfileBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginTop: 12,
  },

  emptySubText: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
});
