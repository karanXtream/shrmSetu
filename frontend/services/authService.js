/**
 * Authentication API Service
 * Handles user registration and login
 */

const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/$/, '');
console.log('app_url', API_URL);

const REQUEST_TIMEOUT_MS = 12000;

const fetchJsonWithTimeout = async (url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    return { response, data };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('The server is taking too long to respond. Please try again.');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const getMimeType = (filename = '') => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'mp4') return 'video/mp4';
  if (ext === 'mov') return 'video/quicktime';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
};

export const authService = {
  /**
   * Register a new user (worker or hirer)
   * @param {Object} userData - User registration data
   * @param {Array} files - File objects {type: 'profilePhoto'|'shopPhotos'|'introVideo', uri, name, type}
   * @returns {Promise<Object>} - Response from backend
   */
  register: async (userData, files = []) => {
    try {
      if (!API_URL) {
        throw new Error('EXPO_PUBLIC_API_URL is not set');
      }

      const formData = new FormData();

      // Add text fields
      formData.append('fullName', userData.fullName);
      formData.append('phoneNumber', userData.phoneNumber);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);
      formData.append('city', userData.city);
      formData.append('state', userData.state);
      formData.append('pincode', userData.pincode);
      formData.append('addressLine1', userData.addressLine1);
      formData.append('addressLine2', userData.addressLine2 || '');

      // Add worker-specific fields
      if (userData.role === 'worker' || userData.role === 'work') {
        formData.append('education', userData.education || '');
        formData.append('yearsOfExperience', userData.yearsOfExperience || '0');
        if (userData.skills && userData.skills.length > 0) {
          formData.append('skills', Array.isArray(userData.skills) ? userData.skills.join(',') : String(userData.skills));
        }
      }

      // Add files (React Native style: append { uri, name, type } directly)
      for (const file of files) {
        if (file.type === 'profilePhoto' && file.uri) {
          const profileName = file.name || 'profile.jpg';
          formData.append('profilePhoto', {
            uri: file.uri,
            name: profileName,
            type: getMimeType(profileName),
          });
        } else if (file.type === 'shopPhotos' && file.uri) {
          const shopName = file.name || 'shop.jpg';
          formData.append('shopPhotos', {
            uri: file.uri,
            name: shopName,
            type: getMimeType(shopName),
          });
        } else if (file.type === 'introVideo' && file.uri) {
          const videoName = file.name || 'intro.mp4';
          formData.append('introVideo', {
            uri: file.uri,
            name: videoName,
            type: getMimeType(videoName),
          });
        }
      }

      const { response, data } = await fetchJsonWithTimeout(`${API_URL}/api/auth/register`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type, let fetch handle it with boundary
        },
      });

      if (!response.ok || !data?.success) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user with email/phone and password
   * @param {string} identifier - Email or phone number
   * @param {string} password - User password
   * @returns {Promise<Object>} - Response with user data and token
   */
  login: async (identifier, password) => {
    try {
      const { response, data } = await fetchJsonWithTimeout(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Verify phone number
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Response with OTP sent confirmation
   */
  verifyPhone: async (userId) => {
    try {
      const { response, data } = await fetchJsonWithTimeout(`${API_URL}/api/auth/verify-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(data.message || 'Phone verification failed');
      }

      return data;
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  },

  /**
   * Delete worker profile and associated user account (cascading delete)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Deletion confirmation
   */
  deleteWorkerProfile: async (userId) => {
    try {
      if (!API_URL) {
        throw new Error('EXPO_PUBLIC_API_URL is not set');
      }

      const { response, data } = await fetchJsonWithTimeout(`${API_URL}/api/workers/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete worker profile');
      }

      return data;
    } catch (error) {
      console.error('Delete worker profile error:', error);
      throw error;
    }
  },
};
