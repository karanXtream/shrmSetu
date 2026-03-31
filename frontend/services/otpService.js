import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * OTP Service
 * Handles Firebase phone authentication
 * 
 * Flow:
 * 1. Send OTP: sendOTP(phoneNumber) → returns confirmationResult
 * 2. Verify OTP: verifyOTP(confirmationResult, otp) → returns user
 * 3. Logout: logout()
 */

// Development placeholder: Store OTP in memory for validation
let developerOTP = null;
let developerPhoneNumber = null;

export const otpService = {
  /**
   * Send OTP to phone number
   * @param {string} phoneNumber - Format: +91XXXXXXXXXX or +1XXXXXXXXXX
   * @returns {Promise<confirmationResult>}
   */
  sendOTP: async (phoneNumber) => {
    try {
      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }

      // Validate format (starts with +)
      if (!phoneNumber.startsWith('+')) {
        throw new Error('Phone number must include country code (e.g., +91)');
      }

      console.log('[OTP Service] Sending OTP to:', phoneNumber);

      // TODO: When ready, uncomment:
      // const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber);
      // console.log('[OTP Service] OTP sent, verification ID:', confirmationResult.verificationId);
      // return confirmationResult;

      // Placeholder for development - Generate and validate OTP locally
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      developerOTP = generatedOTP;
      developerPhoneNumber = phoneNumber;
      
      console.log('[OTP Service] DEVELOPMENT MODE - OTP for testing:', generatedOTP);
      
      return {
        verificationId: 'fake-verification-id-' + Date.now(),
        confirm: async (otp) => {
          // Validate OTP matches
          if (otp !== developerOTP) {
            throw new Error('Invalid OTP. Please enter the correct code.');
          }
          
          return {
            user: {
              uid: 'fake-uid-' + Date.now(),
              phoneNumber,
            },
          };
        },
      };
    } catch (error) {
      console.error('[OTP Service] Send OTP failed:', error);
      throw {
        code: error.code || 'SEND_OTP_FAILED',
        message: error.message || 'Failed to send OTP',
      };
    }
  },

  /**
   * Verify OTP sent to user's phone
   * @param {confirmationResult} confirmationResult - From sendOTP()
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise<user>}
   */
  verifyOTP: async (confirmationResult, otp) => {
    try {
      if (!confirmationResult) {
        throw new Error('Confirmation result is required');
      }

      if (!otp || otp.length !== 6) {
        throw new Error('OTP must be 6 digits');
      }

      console.log('[OTP Service] Verifying OTP...');

      // TODO: When ready, uncomment:
      // const credential = PhoneAuthProvider.credential(
      //   confirmationResult.verificationId,
      //   otp
      // );
      // const result = await signInWithCredential(auth, credential);
      // console.log('[OTP Service] OTP verified, user logged in:', result.user.phoneNumber);
      // return result.user;

      // Placeholder for development - validate with stored OTP
      const fakeResult = await confirmationResult.confirm(otp);
      
      // Clear OTP after verification
      developerOTP = null;
      developerPhoneNumber = null;
      
      return fakeResult.user;
    } catch (error) {
      console.error('[OTP Service] Verify OTP failed:', error);
      throw {
        code: error.code || 'VERIFY_OTP_FAILED',
        message: error.message || 'Failed to verify OTP',
      };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      console.log('[OTP Service] Logging out...');

      // TODO: When ready, uncomment:
      // await signOut(auth);

      console.log('[OTP Service] Logged out successfully');
    } catch (error) {
      console.error('[OTP Service] Logout failed:', error);
      throw {
        code: error.code || 'LOGOUT_FAILED',
        message: error.message || 'Failed to logout',
      };
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return auth.currentUser;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!auth.currentUser;
  },
};

export default otpService;
