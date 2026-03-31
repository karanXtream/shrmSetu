/**
 * Query Keys Factory
 * Centralized query key management for consistency and efficiency
 * Reference: https://tanstack.com/query/latest/docs/react/guides/important-defaults
 */

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'],
    profile: () => [...queryKeys.auth.all, 'profile'],
    status: () => [...queryKeys.auth.all, 'status'],
  },

  // Users
  users: {
    all: ['users'],
    lists: () => [...queryKeys.users.all, 'list'],
    list: (filters) => [...queryKeys.users.lists(), { ...filters }],
    details: () => [...queryKeys.users.all, 'detail'],
    detail: (id) => [...queryKeys.users.details(), id],
    profile: (id) => [...queryKeys.users.detail(id), 'profile'],
  },

  // Workers
  workers: {
    all: ['workers'],
    lists: () => [...queryKeys.workers.all, 'list'],
    list: (filters) => [...queryKeys.workers.lists(), { ...filters }],
    details: () => [...queryKeys.workers.all, 'detail'],
    detail: (id) => [...queryKeys.workers.details(), id],
    search: (skill, filters) => [...queryKeys.workers.all, 'search', skill, { ...filters }],
    top: (limit) => [...queryKeys.workers.all, 'top', limit],
    stats: (id) => [...queryKeys.workers.detail(id), 'stats'],
    media: {
      all: () => [...queryKeys.workers.all, 'media'],
      photos: (id) => [...queryKeys.workers.media.all(), 'photos', id],
      video: (id) => [...queryKeys.workers.media.all(), 'video', id],
    },
    skills: (id) => [...queryKeys.workers.detail(id), 'skills'],
    ratings: (id) => [...queryKeys.workers.detail(id), 'ratings'],
  },

  // Skills
  skills: {
    all: ['skills'],
    lists: () => [...queryKeys.skills.all, 'list'],
    suggestions: (query) => [...queryKeys.skills.all, 'suggestions', query],
  },

  // Locations
  locations: {
    all: ['locations'],
    search: (query) => [...queryKeys.locations.all, 'search', query],
  },

  // Utility function to invalidate related queries
  invalidateWorkerProfile: (id) => ({
    queryKey: queryKeys.workers.detail(id),
    exact: false, // Invalidates detail and all nested queries
  }),

  invalidateWorkerList: () => ({
    queryKey: queryKeys.workers.lists(),
    exact: false, // Invalidates all list variations
  }),
};

export default queryKeys;
