import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Firebase Configuration
 * Uses environment variables from .env.local
 */

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate required config
const requiredFields = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
];

const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
if (missingFields.length > 0) {
  console.warn('⚠️ Missing Firebase config:', missingFields);
  console.warn('Please add these to .env.local');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
let auth;

try {
  // Detect environment correctly
  const isReactNative = Platform.OS !== 'web' && Platform.OS !== undefined;
  
  if (isReactNative) {
    // React Native environment (iOS, Android via Expo)
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
      console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
    } catch (rnError) {
      console.warn('⚠️ React Native auth init failed, falling back to getAuth:', rnError.message);
      auth = getAuth(app);
    }
  } else {
    // Web environment (Expo Web, browsers)
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('⚠️ Web persistence setup warning:', err.message);
    });
    console.log('✅ Firebase Auth initialized with web persistence');
  }
} catch (error) {
  if (error.code === 'auth/already-initialize') {
    console.log('Firebase Auth already initialized');
    auth = getAuth(app);
  } else {
    console.error('❌ Firebase Auth init error:', error.message);
    auth = getAuth(app);
  }
}

/**
 * Auth state listener
 * Tracks user login/logout
 */
export const onAuthStateChange = (callback) => {
  return auth.onAuthStateChanged(user => {
    if (user) {
      console.log('User logged in:', user.phoneNumber);
      callback({
        isSignedIn: true,
        user: {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          metadata: user.metadata,
        },
      });
    } else {
      console.log('User logged out');
      callback({
        isSignedIn: false,
        user: null,
      });
    }
  });
};

export { app, auth, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, signOut };

export default app;
