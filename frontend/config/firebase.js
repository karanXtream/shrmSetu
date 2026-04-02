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

/**
 * reCAPTCHA Configuration
 * Required for Firebase Phone Auth in Expo
 */
export const RECAPTCHA_SITE_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY;

/**
 * Validates Firebase configuration
 * For real OTP, ALL fields must be present
 */
const validateFirebaseConfig = () => {
  const requiredFields = {
    'apiKey': 'API Key for authentication',
    'authDomain': 'Domain for auth',
    'projectId': 'Firebase project ID',
    'appId': 'Firebase app ID',
  };

  const missing = [];
  const empty = [];

  Object.entries(requiredFields).forEach(([field, description]) => {
    if (!firebaseConfig[field]) {
      missing.push(`${field} (${description})`);
    }
    if (firebaseConfig[field] === 'undefined' || firebaseConfig[field] === '') {
      empty.push(field);
    }
  });

  if (missing.length > 0) {
    console.warn('⚠️  Missing Firebase config fields:');
    missing.forEach(m => console.warn(`   - ${m}`));
    console.warn('   Fix: Add these to .env.local and restart app');
  }

  if (empty.length > 0) {
    console.warn('⚠️  Firebase config fields are empty:', empty);
    console.warn('   Fix: Check .env.local for undefined/empty values');
  }

  return missing.length === 0 && empty.length === 0;
};

// Run validation
const isConfigValid = validateFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
let auth;

try {
  // Detect environment correctly
  const isReactNative = Platform.OS !== 'web' && Platform.OS !== undefined;
  
  if (isReactNative) {
    // React Native environment (iOS, Android via Expo)
    // First try to get existing auth instance (in case already initialized)
    try {
      auth = getAuth(app);
      console.log('✅ Firebase Auth already initialized, using existing instance');
    } catch {
      // If getAuth fails, try fresh initialization
      try {
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
        console.log('✅ Firebase Auth initialized with AsyncStorage persistence');
      } catch (rnError) {
        console.warn('⚠️ React Native auth init error:', rnError.message);
        // Last resort: use getAuth with default settings
        auth = getAuth(app);
        console.log('✅ Firebase Auth initialized with default settings');
      }
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
  console.error('❌ Firebase Auth init error:', error.message);
  // Absolute fallback
  auth = getAuth(app);
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

export { app, auth, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, signOut, isConfigValid };

export default app;
