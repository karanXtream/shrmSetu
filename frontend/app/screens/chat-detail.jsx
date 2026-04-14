import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import socketService from "../../services/socketService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatDetailScreen() {
  const router = useRouter();
  const { chatId, chatName, initialMessage } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [negotiationAmount, setNegotiationAmount] = useState(null);
  const flatListRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Load current user
    const loadUser = async () => {
      const userJson = await AsyncStorage.getItem("userData");
      if (userJson) {
        setCurrentUser(JSON.parse(userJson));
      }
    };
    loadUser();
  }, []);

  // Set up socket message listener when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 Chat detail screen focused - setting up message listener');
      
      const unsubscribe = socketService.onMessage((message) => {
        console.log('💬 New message on chat detail:', message);
        
        // Only add message if it's from the current chat sender
        if (message.senderId === chatId) {
          const newMessage = {
            id: String(Date.now()),
            sender: "other",
            text: message.message,
            timestamp: message.timestamp || new Date(),
            senderName: message.senderName,
          };
          
          setMessages((prev) => [...prev, newMessage]);
          
          // Extract and update negotiation amount if provided
          if (message.negotiationAmount) {
            setNegotiationAmount(message.negotiationAmount);
          }
          
          // Scroll to bottom
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      });

      return () => {
        console.log('📱 Chat detail screen unfocused - cleaning up listener');
        unsubscribe();
      };
    }, [chatId])
  );

  useEffect(() => {
    // Initialize with messages from params (initial socket message when navigating to new chat)
    if (initialMessage) {
      try {
        const msgData = JSON.parse(initialMessage);
        const initialMsg = {
          id: String(Date.now()),
          sender: "other",
          text: msgData.text || msgData.message,
          timestamp: new Date(msgData.timestamp || Date.now()),
          senderName: msgData.senderName,
        };
        setMessages([initialMsg]);
        // Extract negotiation amount from the message
        if (msgData.negotiationAmount) {
          setNegotiationAmount(msgData.negotiationAmount);
        }
        console.log('📨 Initial message loaded:', initialMsg);
      } catch (error) {
        console.error('Error parsing initial message:', error);
        setMessages([]);
      }
    } else {
      // Start with empty messages if no initial message
      setMessages([]);
    }
  }, [chatId, initialMessage]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: String(messages.length + 1),
      sender: "me",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#003f87" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{chatName}</Text>
          <Text style={styles.headerSubtitle}>Active now</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="#003f87" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MESSAGES LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item, index }) => {
          const showDate =
            index === 0 ||
            formatDate(messages[index - 1].timestamp) !== formatDate(item.timestamp);

          return (
            <>
              {showDate && (
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
                </View>
              )}
              <View
                style={[
                  styles.messageItem,
                  item.sender === "me" ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "me"
                      ? styles.myMessageBubble
                      : styles.otherMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.sender === "me"
                        ? styles.myMessageText
                        : styles.otherMessageText,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      item.sender === "me"
                        ? styles.myMessageTime
                        : styles.otherMessageTime,
                    ]}
                  >
                    {formatTime(item.timestamp)}
                  </Text>
                </View>
                {item.sender === "other" && (
                  <TouchableOpacity
                    style={styles.viewProfileBtnSmall}
                    onPress={async () => {
                      console.log("Navigating to worker profile with ID:", chatId, "negotiationAmount:", negotiationAmount);
                      try {
                        await AsyncStorage.setItem('tempNegotiationAmount', String(negotiationAmount || ''));
                        console.log('✅ Stored negotiationAmount in AsyncStorage:', negotiationAmount);
                      } catch (e) {
                        console.error('Error storing negotiationAmount:', e);
                      }
                      router.push({
                        pathname: "/screens/worker-profile",
                        params: { 
                          workerId: chatId,
                        },
                      });
                    }}
                  >
                    <Text style={styles.viewProfileBtnSmallText}>View Profile</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          );
        }}
      />

      {/* INPUT AREA */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#ccc"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => console.log("Attach file")}
          >
            <Ionicons name="attach" size={20} color="#003f87" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? "#fff" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 42,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
    gap: 12,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  viewProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003f87",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },

  viewProfileBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  viewProfileBtnSmall: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#003f87",
    borderRadius: 8,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  viewProfileBtnSmallText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexGrow: 1,
  },

  dateContainer: {
    alignItems: "center",
    marginVertical: 16,
  },

  dateText: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  messageItem: {
    marginBottom: 12,
    flexDirection: "column",
    alignItems: "flex-start",
  },

  myMessage: {
    alignItems: "flex-end",
  },

  otherMessage: {
    alignItems: "flex-start",
  },

  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },

  myMessageBubble: {
    backgroundColor: "#003f87",
  },

  otherMessageBubble: {
    backgroundColor: "#e8e8e8",
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },

  myMessageText: {
    color: "#fff",
  },

  otherMessageText: {
    color: "#222",
  },

  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },

  myMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },

  otherMessageTime: {
    color: "#999",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
  },

  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 8,
    gap: 4,
  },

  textInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    maxHeight: 100,
    color: "#333",
  },

  attachButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  sendButton: {
    backgroundColor: "#003f87",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
