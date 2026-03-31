import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from './queryKeys';
import { workerAPI, userAPI, authAPI, skillAPI, locationAPI } from './api';

/**
 * Query Hooks using TanStack Query
 * Each hook uses proper query keys for caching efficiency
 * 
 * Structure:
 * - useXXXX (queries)
 * - useXXXXMutation (mutations for create/update/delete)
 */

// ============ Auth Hooks ============
export const useAuthProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      // TODO: Implement when API is ready
      return authAPI.logout();
    },
    enabled: false, // Disabled until API is implemented
  });
};

// ============ Worker Hooks - Queries ============

/**
 * Get single worker profile with full details
 */
export const useWorker = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.workers.detail(id),
    queryFn: async () => {
      // TODO: return await workerAPI.getProfile(id);
      console.log('[Query] Fetching worker:', id);
      return null;
    },
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

/**
 * Get list of all available workers
 */
export const useWorkers = (skip = 0, limit = 10, options = {}) => {
  return useQuery({
    queryKey: queryKeys.workers.list({ skip, limit }),
    queryFn: async () => {
      // TODO: return await workerAPI.getAllWorkers(skip, limit);
      console.log('[Query] Fetching workers list:', { skip, limit });
      return [];
    },
    ...options,
  });
};

/**
 * Search workers by skill
 */
export const useWorkersBySkill = (skill, skip = 0, limit = 10, options = {}) => {
  return useQuery({
    queryKey: queryKeys.workers.search(skill, { skip, limit }),
    queryFn: async () => {
      // TODO: return await workerAPI.searchBySkill(skill, skip, limit);
      console.log('[Query] Searching workers by skill:', skill);
      return [];
    },
    enabled: !!skill && options.enabled !== false,
    ...options,
  });
};

/**
 * Get top-rated workers
 */
export const useTopWorkers = (limit = 5, options = {}) => {
  return useQuery({
    queryKey: queryKeys.workers.top(limit),
    queryFn: async () => {
      // TODO: return await workerAPI.getTopWorkers(limit);
      console.log('[Query] Fetching top workers');
      return [];
    },
    staleTime: 30 * 60 * 1000, // Stay fresh for 30 minutes
    ...options,
  });
};

/**
 * Get worker statistics
 */
export const useWorkerStats = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.workers.stats(id),
    queryFn: async () => {
      // TODO: return await workerAPI.getStats(id);
      console.log('[Query] Fetching worker stats:', id);
      return null;
    },
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

// ============ Worker Hooks - Mutations ============

/**
 * Create worker profile
 */
export const useCreateWorkerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      // TODO: return await workerAPI.createProfile(data);
      console.log('[Mutation] Creating worker profile');
      return null;
    },
    onSuccess: () => {
      // Invalidate workers list to refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.workers.lists(),
      });
    },
    onError: (error) => {
      console.error('[Mutation Error] Create worker failed:', error);
    },
  });
};

/**
 * Update worker profile
 */
export const useUpdateWorkerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // TODO: return await workerAPI.updateProfile(id, data);
      console.log('[Mutation] Updating worker profile:', id);
      return null;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific worker and list
      queryClient.invalidateQueries(
        queryKeys.invalidateWorkerProfile(variables.id)
      );
    },
    onError: (error) => {
      console.error('[Mutation Error] Update worker failed:', error);
    },
  });
};

/**
 * Add skill to worker
 */
export const useAddSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, skill }) => {
      // TODO: return await workerAPI.addSkill(id, skill);
      console.log('[Mutation] Adding skill:', skill);
      return null;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(
        queryKeys.invalidateWorkerProfile(variables.id)
      );
    },
  });
};

/**
 * Add rating to worker
 */
export const useAddRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rating }) => {
      // TODO: return await workerAPI.addRating(id, rating);
      console.log('[Mutation] Adding rating:', rating);
      return null;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(
        queryKeys.invalidateWorkerProfile(variables.id)
      );
    },
  });
};

/**
 * Toggle worker availability
 */
export const useToggleAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isAvailable }) => {
      // TODO: return await workerAPI.toggleAvailability(id, isAvailable);
      console.log('[Mutation] Toggling availability:', isAvailable);
      return null;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(
        queryKeys.invalidateWorkerProfile(variables.id)
      );
    },
  });
};

// ============ Skills Hooks ============
export const useSkills = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.skills.all,
    queryFn: async () => {
      // TODO: return await skillAPI.getAll();
      console.log('[Query] Fetching skills');
      return [];
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    ...options,
  });
};

// ============ Location Hooks ============
export const useCities = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.locations.all,
    queryFn: async () => {
      // TODO: return await locationAPI.getAllCities();
      console.log('[Query] Fetching cities');
      return [];
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    ...options,
  });
};

export default {
  // Worker
  useWorker,
  useWorkers,
  useWorkersBySkill,
  useTopWorkers,
  useWorkerStats,
  useCreateWorkerProfile,
  useUpdateWorkerProfile,
  useAddSkill,
  useAddRating,
  useToggleAvailability,
  
  // Skills
  useSkills,
  
  // Location
  useCities,
};
