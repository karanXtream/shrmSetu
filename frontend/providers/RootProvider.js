import React, { createContext, useContext, useCallback, useState } from 'react';
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

  // Restore token on app load
  const restoreToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsSignedIn(true);
      }
    } catch (e) {
      console.error('Failed to restore token:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (userData, token) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsSignedIn(true);
    } catch (e) {
      console.error('Failed to save auth data:', e);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsSignedIn(false);
      
      // Clear all queries on logout
      queryClient.clear();
    } catch (e) {
      console.error('Failed to logout:', e);
      throw e;
    }
  }, []);

  const value = {
    user,
    isLoading,
    isSignedIn,
    restoreToken,
    login,
    logout,
  };

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
