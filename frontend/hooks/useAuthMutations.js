/**
 * Authentication Hooks using TanStack Query (React Query)
 * Provides proper state management for auth API calls
 */

import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuth } from '../providers/RootProvider';

/**
 * Hook for user registration
 * @returns {Object} - useMutation result with mutate, isPending, error, data
 */
export const useRegister = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async ({ userData, files }) => {
      return await authService.register(userData, files);
    },
    onSuccess: async (data) => {
      if (data.success && data.data) {
        // Save auth data
        const token = data.data.token || data.data._id;
        await login(data.data, token);
      }
    },
    onError: (error) => {
      console.error('Registration mutation error:', error);
    },
  });
};

/**
 * Hook for user login
 * @returns {Object} - useMutation result with mutate, isPending, error, data
 */
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async ({ identifier, password }) => {
      return await authService.login(identifier, password);
    },
    onSuccess: async (data) => {
      if (data.success && data.data) {
        // Save auth data
        const token = data.data.token || data.data._id;
        await login(data.data, token);
      }
    },
    onError: (error) => {
      console.error('Login mutation error:', error);
    },
  });
};

/**
 * Hook for phone verification
 * @returns {Object} - useMutation result with mutate, isPending, error, data
 */
export const useVerifyPhone = () => {
  return useMutation({
    mutationFn: async (userId) => {
      return await authService.verifyPhone(userId);
    },
    onError: (error) => {
      console.error('Phone verification mutation error:', error);
    },
  });
};
