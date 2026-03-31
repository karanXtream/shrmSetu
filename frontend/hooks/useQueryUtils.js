import React, { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Common Hooks and Utilities for Query Operations
 */

/**
 * Combine query and mutation state management
 * @param {Object} useQuery result
 * @param {Object} useMutation result
 * @returns {Object} Combined state
 */
export const useCombinedQuery = (queryResult, mutationResult) => {
  return {
    data: queryResult.data ?? mutationResult.data,
    isLoading: queryResult.isLoading || mutationResult.isPending,
    error: queryResult.error || mutationResult.error,
    isSuccess: queryResult.isSuccess && !mutationResult.isPending,
  };
};

/**
 * Manage pagination state efficiently
 */
export const usePagination = (initialPage = 0, limit = 10) => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(initialPage);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetPage = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  const skip = page * limit;

  return {
    page,
    skip,
    limit,
    nextPage,
    prevPage,
    setPage,
    resetPage,
  };
};

/**
 * Refetch query with loading state
 */
export const useRefetch = () => {
  const queryClient = useQueryClient();

  return useCallback(async (queryKey) => {
    try {
      return await queryClient.refetchQueries({ queryKey });
    } catch (error) {
      console.error('Refetch failed:', error);
      throw error;
    }
  }, [queryClient]);
};

/**
 * Prefetch query for smoother UX
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  return useCallback(async (queryKey, queryFn) => {
    try {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }, [queryClient]);
};

/**
 * Invalidate and refetch query
 */
export const useInvalidateAndRefetch = () => {
  const queryClient = useQueryClient();

  return useCallback(async (queryKey) => {
    try {
      await queryClient.invalidateQueries({ queryKey });
      return await queryClient.refetchQueries({ queryKey });
    } catch (error) {
      console.error('Invalidate and refetch failed:', error);
      throw error;
    }
  }, [queryClient]);
};

/**
 * Set query data manually (for optimistic updates)
 */
export const useSetQueryData = () => {
  const queryClient = useQueryClient();

  return useCallback((queryKey, data) => {
    queryClient.setQueryData(queryKey, data);
  }, [queryClient]);
};

export default {
  useCombinedQuery,
  usePagination,
  useRefetch,
  usePrefetch,
  useInvalidateAndRefetch,
  useSetQueryData,
};
