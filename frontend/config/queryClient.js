import { QueryClient } from '@tanstack/react-query';

/**
 * Centralized Query Client Configuration
 * Handles caching, retries, and data management
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Keep cache in memory for 10 minutes before garbage collection
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests 2 times
      retry: 2,
      
      // Exponential backoff: 1s, 2s, 4s max
      retryDelay: (attemptIndex) => 
        Math.min(1000 * Math.pow(2, attemptIndex), 30000),
      
      // Don't refetch on window focus (for efficiency)
      refetchOnWindowFocus: false,
      
      // Don't refetch on reconnect
      refetchOnReconnect: false,
      
      // Don't refetch when component remounts
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
    },
  },
});

/**
 * Query Client reset for testing/logout
 */
export const resetQueryClient = () => {
  queryClient.clear();
};

export default queryClient;
