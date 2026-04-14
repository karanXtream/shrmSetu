import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const API_BASE_URL = (() => {
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

let isAsyncStorageAvailable = true;

const getAuthToken = async () => {
  if (!isAsyncStorageAvailable) {
    return null;
  }

  try {
    if (!AsyncStorage || typeof AsyncStorage.getItem !== 'function') {
      isAsyncStorageAvailable = false;
      return null;
    }

    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    const message = String(error?.message || '');

    if (message.toLowerCase().includes('native module is null')) {
      isAsyncStorageAvailable = false;
      return null;
    }

    console.warn('Error reading auth token:', error);
    return null;
  }
};

/**
 * Axios instance with interceptors for auth, errors, and retries
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request Interceptor - Add auth token
 */
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      try {
        if (isAsyncStorageAvailable && AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
          await AsyncStorage.removeItem('authToken');
        }
        // TODO: Navigate to login screen
      } catch (err) {
        const message = String(err?.message || '');
        if (!message.toLowerCase().includes('native module is null')) {
          console.error('Error clearing auth token:', err);
        }
      }
    }

    // Return error with proper structure
    const errorData = {
      message:
        error.response?.data?.message ||
        (error.message === 'Network Error'
          ? `Network Error: Unable to reach API at ${API_BASE_URL}`
          : error.message) ||
        'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(errorData);
  }
);

export { API_BASE_URL };
export default apiClient;
