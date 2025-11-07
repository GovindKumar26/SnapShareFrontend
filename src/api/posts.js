import axios from './axios';

/**
 * Posts API service
 * Centralized API calls for post-related operations
 */
export const postsApi = {
  /**
   * Fetch posts with pagination and optional search
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (1-indexed)
   * @param {number} params.limit - Number of posts per page
   * @param {string} params.search - Optional search query
   * @returns {Promise} Axios response with { posts, pagination }
   */
  fetchPosts: ({ page = 1, limit = 10, search = '' } = {}) => {
    return axios.get('/api/posts', {
      params: { page, limit, search },
    });
  },

  /**
   * Fetch posts for a specific user
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Axios response with { posts, pagination }
   */
  fetchUserPosts: (userId, { page = 1, limit = 10 } = {}) => {
    return axios.get(`/api/posts/user/${userId}`, {
      params: { page, limit },
    });
  },

  /**
   * Create a new post
   * @param {FormData} formData - Form data containing title, caption, and image
   * @returns {Promise} Axios response with { message, post }
   */
  createPost: (formData) => {
    return axios.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete a post
   * @param {string} postId - Post ID to delete
   * @returns {Promise} Axios response with { message }
   */
  deletePost: (postId) => {
    return axios.delete(`/api/posts/${postId}`);
  },

  /**
   * Toggle like/unlike on a post
   * @param {string} postId - Post ID to like/unlike
   * @returns {Promise} Axios response with { liked, likeCount }
   */
  toggleLike: (postId) => {
    return axios.post('/api/likes/toggle', { postId });
  },
};
