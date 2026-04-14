import { io } from 'socket.io-client';
import { Platform } from 'react-native';

// Initialize API_URL using the same logic as axios config
const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const API_URL = (() => {
  let normalized = String(rawApiUrl || '').trim();

  if (!normalized) {
    normalized = 'http://localhost:5000';
  }

  // Fix common typo like 10.0.2.:5000
  normalized = normalized.replace('10.0.2.:', '10.0.2.2:');

  // Android emulator cannot access host machine through localhost.
  if (
    Platform.OS === 'android' &&
    (normalized.includes('localhost') || normalized.includes('127.0.0.1'))
  ) {
    normalized = normalized
      .replace('localhost', '10.0.2.2')
      .replace('127.0.0.1', '10.0.2.2');
  }

  // Local emulator/dev backend usually runs on http only.
  if (normalized.startsWith('https://10.0.2.2') || normalized.startsWith('https://localhost')) {
    normalized = normalized.replace('https://', 'http://');
  }

  return normalized;
})();

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userId) {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Connecting socket to:', API_URL);
        this.socket = io(API_URL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket connected:', this.socket.id);
          this.isConnected = true;
          
          // Register user with backend
          this.socket.emit('registerUser', userId);
          console.log(`🔗 Registered user ${userId}`);
          
          resolve(this.socket);
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
          reject(error);
        });

        this.socket.on('error', (error) => {
          console.error('❌ Socket error:', error);
        });

        this.socket.on('disconnect', () => {
          console.log('⚠️ Socket disconnected');
          this.isConnected = false;
        });

      } catch (error) {
        console.error('❌ Error connecting socket:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    console.log('🔌 Disconnecting socket');
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      console.log('📤 Emitting:', event, data);
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit:', event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      console.log('📥 Listening to:', event);
      this.socket.on(event, callback);
      
      // Return unsubscribe function
      return () => {
        this.socket.off(event, callback);
      };
    }
    return () => {};
  }

  onMessage(callback) {
    return this.on('newMessage', callback);
  }

  sendMessage(data) {
    console.log('📤 [SOCKET-SEND] ========= SENDING MESSAGE ==========');
    console.log('📤 [SOCKET-SEND] isConnected:', this.isConnected);
    console.log('📤 [SOCKET-SEND] data:', JSON.stringify(data));
    console.log('📤 [SOCKET-SEND] data.negotiationAmount:', data.negotiationAmount, 'Type:', typeof data.negotiationAmount);
    this.emit('message', data);
    console.log('📤 [SOCKET-SEND] ========= END ==========');
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }
}

export default SocketService.getInstance();
