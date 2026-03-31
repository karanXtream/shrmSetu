import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

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
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error reading auth token:', error);
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
        await AsyncStorage.removeItem('authToken');
        // TODO: Navigate to login screen
      } catch (err) {
        console.error('Error clearing auth token:', err);
      }
    }

    // Return error with proper structure
    const errorData = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(errorData);
  }
);

export default apiClient;
