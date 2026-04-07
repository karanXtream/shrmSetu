import apiClient from '../config/axios';

/**
 * API Service Layer
 * All API endpoint functions go here
 * Use this format for consistency:
 * 
 * export const functionName = async (params) => {
 *   return apiClient.get/post/patch/delete(endpoint, data);
 * };
 */

// ============ Auth API ============
export const authAPI = {
  register: async (userData) => {
    // TODO: Implement with FormData for files
    // const formData = new FormData();
    // // append fields and files
    // return apiClient.post('/api/auth/register', formData);
    console.log('AUTH: register', userData);
  },

  login: async (identifier, password) => {
    // TODO: return apiClient.post('/api/auth/login', { identifier, password });
    console.log('AUTH: login', identifier);
  },

  verifyPhone: async (userId) => {
    // TODO: return apiClient.post('/api/auth/verify-phone', { userId });
    console.log('AUTH: verifyPhone', userId);
  },

  logout: async () => {
    // TODO: return apiClient.post('/api/auth/logout');
    console.log('AUTH: logout');
  },
};

// ============ User API ============
export const userAPI = {
  getProfile: async (id) => {
    // TODO: return apiClient.get(`/api/users/${id}`);
    console.log('USER: getProfile', id);
  },

  updateProfile: async (id, data) => {
    // TODO: return apiClient.patch(`/api/users/${id}`, data);
    console.log('USER: updateProfile', id, data);
  },

  getAllUsers: async (skip = 0, limit = 10) => {
    // TODO: return apiClient.get('/api/users', { params: { skip, limit } });
    console.log('USER: getAllUsers', skip, limit);
  },
};

// ============ Worker API ============
export const workerAPI = {
  // Get & Create
  createProfile: async (data) => {
    // TODO: return apiClient.post('/api/workers', data);
    console.log('WORKER: createProfile', data);
  },

  getProfile: async (id) => {
    return apiClient.get(`/api/workers/${id}`);
  },

  updateProfile: async (id, data) => {
    // TODO: return apiClient.patch(`/api/workers/${id}`, data);
    console.log('WORKER: updateProfile', id, data);
  },

  // List & Search
  getAllWorkers: async (skip = 0, limit = 10) => {
    // TODO: return apiClient.get('/api/workers', { params: { skip, limit } });
    console.log('WORKER: getAllWorkers', skip, limit);
  },

  searchBySkill: async (skill, skip = 0, limit = 10) => {
    // TODO: return apiClient.get(`/api/workers/search/${skill}`, { params: { skip, limit } });
    console.log('WORKER: searchBySkill', skill, skip, limit);
  },

  getTopWorkers: async (limit = 5) => {
    // TODO: return apiClient.get('/api/workers/top', { params: { limit } });
    console.log('WORKER: getTopWorkers', limit);
  },

  // Stats & Info
  getStats: async (id) => {
    // TODO: return apiClient.get(`/api/workers/${id}/stats`);
    console.log('WORKER: getStats', id);
  },

  // Media Operations
  uploadProfilePhoto: async (id, photoUri) => {
    // TODO: const formData = new FormData();
    // TODO: formData.append('photoUrl', { uri: photoUri, type: 'image/jpeg', name: 'photo.jpg' });
    // TODO: return apiClient.post(`/api/workers/${id}/photo`, formData);
    console.log('WORKER: uploadProfilePhoto', id);
  },

  uploadVideo: async (id, videoUri) => {
    // TODO: Implement FormData upload
    console.log('WORKER: uploadVideo', id);
  },

  addShopPhoto: async (id, photoUri) => {
    // TODO: Implement FormData upload
    console.log('WORKER: addShopPhoto', id);
  },

  removeShopPhoto: async (id, photoUrl) => {
    // TODO: return apiClient.delete(`/api/workers/${id}/shop-photo`, { data: { photoUrl } });
    console.log('WORKER: removeShopPhoto', id);
  },

  // Skills
  addSkill: async (id, skill) => {
    // TODO: return apiClient.post(`/api/workers/${id}/skill`, { skill });
    console.log('WORKER: addSkill', id, skill);
  },

  removeSkill: async (id, skill) => {
    // TODO: return apiClient.delete(`/api/workers/${id}/skill`, { data: { skill } });
    console.log('WORKER: removeSkill', id, skill);
  },

  // Availability & Rating
  toggleAvailability: async (id, isAvailable) => {
    // TODO: return apiClient.patch(`/api/workers/${id}/availability`, { isAvailable });
    console.log('WORKER: toggleAvailability', id, isAvailable);
  },

  addRating: async (id, rating) => {
    // TODO: return apiClient.post(`/api/workers/${id}/rating`, { rating });
    console.log('WORKER: addRating', id, rating);
  },
};

// ============ Skills API ============
export const skillAPI = {
  getAll: async () => {
    // TODO: return apiClient.get('/api/skills');
    console.log('SKILL: getAll');
  },

  search: async (query) => {
    // TODO: return apiClient.get(`/api/skills/search`, { params: { q: query } });
    console.log('SKILL: search', query);
  },
};

// ============ Location API ============
export const locationAPI = {
  getAllCities: async () => {
    // TODO: return apiClient.get('/api/locations/cities');
    console.log('LOCATION: getAllCities');
  },

  searchCities: async (query) => {
    // TODO: return apiClient.get('/api/locations/search', { params: { q: query } });
    console.log('LOCATION: searchCities', query);
  },
};

// ============ MSG91 OTP API ============
export const msg91API = {
  sendOtp: async (phoneNumber) => {
    const response = await apiClient.post('/api/msg91/send-otp', { phoneNumber });

    if (!response?.success) {
      throw {
        message: response?.msg91?.message || response?.message || 'Failed to send OTP',
        data: response,
      };
    }

    return response;
  },

  verifyOtp: async (phoneNumber, otp) => {
    const response = await apiClient.post('/api/msg91/verify-otp', { phoneNumber, otp });

    if (!response?.success) {
      throw {
        message: response?.msg91?.message || response?.message || 'Invalid OTP',
        data: response,
      };
    }

    return response;
  },
};

export default {
  authAPI,
  userAPI,
  workerAPI,
  skillAPI,
  locationAPI,
  msg91API,
};
