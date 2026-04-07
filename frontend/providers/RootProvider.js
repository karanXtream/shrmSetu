import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import queryClient from '../config/queryClient';

/**
 * Root Providers Component
 * Wraps entire app with necessary providers
 */

// Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAsyncStorageAvailable, setIsAsyncStorageAvailable] = useState(true);

  const isStorageUnavailableError = (error) => {
    const message = String(error?.message || '').toLowerCase();
    return message.includes('native module is null') || message.includes('legacy storage');
  };

  // Restore token on app load
  const restoreToken = useCallback(async () => {
    if (!isAsyncStorageAvailable) {
      setIsLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsSignedIn(true);
      }
    } catch (e) {
      if (isStorageUnavailableError(e)) {
        setIsAsyncStorageAvailable(false);
        console.warn('AsyncStorage unavailable. Continuing without persisted auth.');
      } else {
        console.error('Failed to restore token:', e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAsyncStorageAvailable]);

  const login = useCallback(async (userData, token) => {
    // Always allow login state in-memory, even if persistence is unavailable.
    setUser(userData);
    setIsSignedIn(true);

    if (!isAsyncStorageAvailable) {
      return;
    }

    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (e) {
      if (isStorageUnavailableError(e)) {
        setIsAsyncStorageAvailable(false);
        console.warn('AsyncStorage unavailable. Auth will persist only for this session.');
      } else {
        console.error('Failed to save auth data:', e);
      }
    }
  }, [isAsyncStorageAvailable]);

  const logout = useCallback(async () => {
    setUser(null);
    setIsSignedIn(false);

    if (!isAsyncStorageAvailable) {
      queryClient.clear();
      return;
    }

    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    } catch (e) {
      if (isStorageUnavailableError(e)) {
        setIsAsyncStorageAvailable(false);
        console.warn('AsyncStorage unavailable during logout.');
      } else {
        console.error('Failed to logout:', e);
      }
    } finally {
      // Clear all queries on logout
      queryClient.clear();
    }
  }, [isAsyncStorageAvailable]);

  const updateUser = useCallback(async (nextUserData) => {
    setUser(nextUserData);

    if (!isAsyncStorageAvailable) {
      return;
    }

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(nextUserData));
    } catch (e) {
      if (isStorageUnavailableError(e)) {
        setIsAsyncStorageAvailable(false);
        console.warn('AsyncStorage unavailable. Profile changes will persist only for this session.');
      } else {
        console.error('Failed to persist updated user data:', e);
      }
    }
  }, [isAsyncStorageAvailable]);

  const value = {
    user,
    isLoading,
    isSignedIn,
    restoreToken,
    login,
    logout,
    updateUser,
  };

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Root Provider Component
export const RootProvider = ({ children }) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default RootProvider;
