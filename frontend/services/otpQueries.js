import { useMutation, useQuery } from '@tanstack/react-query';
import { onAuthStateChange } from '../config/firebase';
import otpService from './otpService';

/**
 * OTP Query Hooks
 * Uses TanStack Query for state management
 */

/**
 * Send OTP mutation
 * Step 1 of OTP flow
 */
export const useSendOTP = () => {
  return useMutation({
    mutationFn: async (phoneNumber) => {
      console.log('[Query] Sending OTP for:', phoneNumber);
      // TODO: return await otpService.sendOTP(phoneNumber);
      return await otpService.sendOTP(phoneNumber);
    },
    onSuccess: (confirmationResult) => {
      console.log('[Query] OTP sent successfully');
    },
    onError: (error) => {
      console.error('[Query Error] Send OTP failed:', error);
    },
  });
};

/**
 * Verify OTP mutation
 * Step 2 of OTP flow
 */
export const useVerifyOTP = (options = {}) => {
  return useMutation({
    mutationFn: async ({ confirmationResult, otp }) => {
      console.log('[Query] Verifying OTP...');
      // TODO: return await otpService.verifyOTP(confirmationResult, otp);
      return await otpService.verifyOTP(confirmationResult, otp);
    },
    onSuccess: (user) => {
      console.log('[Query] OTP verified! User logged in:', user.phoneNumber);
      // Navigate to home screen in component
    },
    onError: (error) => {
      console.error('[Query Error] Verify OTP failed:', error);
    },
    ...options,
  });
};

/**
 * Logout mutation
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      console.log('[Query] Logging out...');
      // TODO: return await otpService.logout();
      return await otpService.logout();
    },
    onSuccess: () => {
      console.log('[Query] Logout successful');
      // Navigate to login screen in component
    },
    onError: (error) => {
      console.error('[Query Error] Logout failed:', error);
    },
  });
};

/**
 * Auth state query
 * Tracks current user authentication status
 */
export const useAuthState = () => {
  return useQuery({
    queryKey: ['auth', 'state'],
    queryFn: () => {
      return new Promise((resolve) => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChange((authState) => {
          resolve(authState);
          unsubscribe();
        });
      });
    },
    staleTime: Infinity, // Don't refetch, rely on listener
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
};

/**
 * Get current user
 */
export const useCurrentUser = () => {
  const user = otpService.getCurrentUser();
  
  return {
    user,
    isAuthenticated: !!user,
  };
};

export default {
  useSendOTP,
  useVerifyOTP,
  useLogout,
  useAuthState,
  useCurrentUser,
};
