import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000').trim().replace(/\/$/, '');

/**
 * Service to handle all Post-related API calls
 */

/**
 * Convert local image URI to base64 string
 * @param {string} imageUri - Local image URI from ImagePicker
 * @returns {Promise<string>} - Base64 encoded image
 */
const convertImageToBase64 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Convert all local images to base64
 * @param {array} photoUris - Array of local image URIs
 * @returns {Promise<array>} - Array of base64 encoded images
 */
const preparePhotosForUpload = async (photoUris) => {
  try {
    if (!photoUris || photoUris.length === 0) {
      return [];
    }

    const base64Photos = await Promise.all(
      photoUris.map(uri => convertImageToBase64(uri))
    );
    
    return base64Photos;
  } catch (error) {
    console.error('Error preparing photos:', error);
    throw error;
  }
};

/**
 * Get the current user ID from AsyncStorage
 * @returns {Promise<string|null>} - User ID or null
 */
const getUserId = async () => {
  try {
    const userJson = await AsyncStorage.getItem('userData');
    if (userJson) {
      const user = JSON.parse(userJson);
      console.log('Retrieved user from AsyncStorage:', { _id: user._id, id: user.id });
      return user._id || user.id;
    }
    console.warn('No user data found in AsyncStorage at key "userData"');
    return null;
  } catch (error) {
    console.error('Error getting user ID from AsyncStorage:', error);
    return null;
  }
};

/**
 * Upload post images to S3
 * @param {Array} imageUris - Array of local image URIs from ImagePicker
 * @returns {Promise<Array>} - Array of S3 URLs
 */
export const uploadPostImages = async (imageUris) => {
  try {
    if (!imageUris || imageUris.length === 0) {
      throw new Error('No images provided');
    }

    console.log(`Uploading ${imageUris.length} images to S3...`);

    // Convert URIs to FormData
    const formData = new FormData();
    
    for (let i = 0; i < imageUris.length; i++) {
      const uri = imageUris[i];
      const filename = `job-photo-${Date.now()}-${i}.jpg`;
      
      // Create blob from URI
      const response = await fetch(uri);
      const blob = await response.blob();
      
      formData.append('workPhotos', {
        uri,
        name: filename,
        type: blob.type || 'image/jpeg',
      });
    }

    const url = `${API_URL}/api/posts/upload`;
    
    console.log('Uploading to:', url);

    const uploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(data.message || 'Failed to upload images');
    }

    if (!data.success) {
      throw new Error(data.message || 'Failed to upload images');
    }

    console.log('Images uploaded successfully:', data.data.images);
    return data.data.images; // Return array of S3 URLs

  } catch (error) {
    console.error('Error uploading images:', error.message);
    throw error;
  }
};

/**
 * Create a new job post
 * @param {object} formData - Form data containing all post details
 * @returns {Promise<object>} - API response
 */
export const createPost = async (formData) => {
  try {
    // Get user ID
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not logged in. Please login first.');
    }

    // Validate form data
    if (!formData.city?.trim()) throw new Error('City is required');
    if (!formData.state?.trim()) throw new Error('State is required');
    if (!formData.pin || formData.pin.length !== 6) throw new Error('PIN must be 6 digits');
    if (!formData.address?.trim()) throw new Error('Address is required');
    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      throw new Error('At least one skill is required');
    }
    if (!formData.expectedPrice) throw new Error('Price is required');
    if (!formData.workPhotos || formData.workPhotos.length === 0) {
      throw new Error('At least one photo is required');
    }

    // Upload images to S3 and get URLs
    console.log('Uploading photos to AWS S3...');
    const imageUrls = await uploadPostImages(formData.workPhotos);

    // Prepare request payload with S3 URLs
    const payload = {
      userId,
      city: formData.city.trim(),
      state: formData.state.trim(),
      pin: formData.pin,
      address: formData.address.trim(),
      requiredSkills: formData.requiredSkills.map(skill => skill.trim()),
      expectedPrice: Number(formData.expectedPrice),
      stayAvailable: Boolean(formData.stayAvailable),
      foodAvailable: Boolean(formData.foodAvailable),
      workPhotos: imageUrls,
    };

    console.log('Sending post request to:', `${API_URL}/api/posts`);
    console.log('Payload:', { ...payload, workPhotos: `[${payload.workPhotos.length} photos]` });

    // Make API request
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post');
    }

    if (!data.success) {
      throw new Error(data.message || 'Failed to create post');
    }

    console.log('Post created successfully:', data.data._id);
    return data;

  } catch (error) {
    console.error('Error creating post:', error.message);
    throw error;
  }
};

/**
 * Get all posts with filters
 * @param {object} filters - Filter options (city, state, skill, status, skip, limit)
 * @returns {Promise<object>} - API response with posts array
 */
export const getAllPosts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.state) queryParams.append('state', filters.state);
    if (filters.skill) queryParams.append('skill', filters.skill);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.skip) queryParams.append('skip', filters.skip);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const url = `${API_URL}/api/posts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    console.log('Fetching posts from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch posts');
    }

    return data;

  } catch (error) {
    console.error('Error fetching posts:', error.message);
    throw error;
  }
};

/**
 * Get a single post by ID
 * @param {string} postId - Post ID
 * @returns {Promise<object>} - API response with post details
 */
export const getPostById = async (postId) => {
  try {
    if (!postId) throw new Error('Post ID is required');

    const url = `${API_URL}/api/posts/${postId}`;
    
    console.log('Fetching post from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch post');
    }

    return data;

  } catch (error) {
    console.error('Error fetching post:', error.message);
    throw error;
  }
};

/**
 * Get all posts by a specific user
 * @param {string} userId - User ID
 * @param {object} filters - Filter options (status, skip, limit)
 * @returns {Promise<object>} - API response with user's posts
 */
export const getPostsByUser = async (userId, filters = {}) => {
  try {
    if (!userId) throw new Error('User ID is required');

    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.skip) queryParams.append('skip', filters.skip);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const url = `${API_URL}/api/posts/user/${userId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user posts');
    }

    return data;

  } catch (error) {
    console.error('Error fetching user posts:', error.message);
    throw error;
  }
};

/**
 * Update a post
 * @param {string} postId - Post ID to update
 * @param {object} updateData - Data to update (all fields optional)
 * @returns {Promise<object>} - API response
 */
export const updatePost = async (postId, updateData) => {
  try {
    if (!postId) throw new Error('Post ID is required');

    const userId = await getUserId();
    if (!userId) throw new Error('User not logged in');

    // Prepare payload
    const payload = {
      userId,
      ...updateData,
    };

    // Convert photos if included in update
    if (updateData.workPhotos) {
      payload.workPhotos = await preparePhotosForUpload(updateData.workPhotos);
    }

    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update post');
    }

    return data;

  } catch (error) {
    console.error('Error updating post:', error.message);
    throw error;
  }
};

/**
 * Delete a post
 * @param {string} postId - Post ID to delete
 * @returns {Promise<object>} - API response
 */
export const deletePost = async (postId) => {
  try {
    if (!postId) throw new Error('Post ID is required');

    const userId = await getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete post');
    }

    return data;

  } catch (error) {
    console.error('Error deleting post:', error.message);
    throw error;
  }
};

/**
 * Apply for a post as a worker
 * @param {string} postId - Post ID to apply for
 * @param {string} workerId - Worker ID
 * @returns {Promise<object>} - API response
 */
export const applyForPost = async (postId, workerId) => {
  try {
    if (!postId) throw new Error('Post ID is required');
    if (!workerId) throw new Error('Worker ID is required');

    const response = await fetch(`${API_URL}/api/posts/${postId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ workerId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to apply for post');
    }

    return data;

  } catch (error) {
    console.error('Error applying for post:', error.message);
    throw error;
  }
};
