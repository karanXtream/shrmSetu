# TanStack Query Setup Documentation

## Overview
This frontend uses **TanStack Query v5** for efficient data fetching, caching, and state management.

## Architecture

```
frontend/
├── config/
│   ├── axios.js              # Axios client with interceptors
│   └── queryClient.js         # TanStack Query configuration
├── services/
│   ├── api.js                 # API endpoint functions (TODO: implement)
│   ├── queryKeys.js           # Centralized query key factory
│   └── queries.js             # React hooks for queries & mutations
├── providers/
│   └── RootProvider.js        # Query & Auth providers
├── hooks/
│   └── useQueryUtils.js       # Utility hooks for common patterns
└── .env.example               # Environment variables template
```

## Key Features

### 1. **Automatic Caching**
- Queries cached for 5 minutes by default
- Memory garbage collection after 10 minutes
- Configurable per query using `options`

### 2. **Smart Retry Logic**
- 2 automatic retries with exponential backoff (1s, 2s, 4s max)
- Configurable per query or mutation

### 3. **Authentication**
- Auth token automatically added to all requests
- Auto-logout on 401 responses
- Token stored in AsyncStorage

### 4. **Error Handling**
- Global error interceptor with consistent error format
- Per-query error handling with `onError` callback

### 5. **Query Invalidation**
- Automatic cache invalidation on mutations
- Nested query key structure for precise invalidation

## Usage Examples

### Query Data
```javascript
import { useWorker } from '../services/queries';

export const WorkerScreen = ({ workerId }) => {
  const { data, isLoading, error } = useWorker(workerId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorScreen error={error} />;
  
  return <WorkerCard worker={data} />;
};
```

### Mutate Data
```javascript
import { useUpdateWorkerProfile } from '../services/queries';

export const EditWorkerScreen = () => {
  const mutation = useUpdateWorkerProfile();
  
  const handleSave = async (formData) => {
    await mutation.mutateAsync({
      id: workerId,
      data: formData,
    });
  };
  
  return (
    <Form
      onSubmit={handleSave}
      isLoading={mutation.isPending}
      error={mutation.error?.message}
    />
  );
};
```

### Pagination
```javascript
import { usePagination } from '../hooks/useQueryUtils';
import { useWorkers } from '../services/queries';

export const WorkersListScreen = () => {
  const { skip, limit, nextPage, prevPage } = usePagination();
  const { data: workers, isLoading } = useWorkers(skip, limit);
  
  return (
    <>
      <WorkersList workers={workers} />
      <Button onPress={nextPage}>Next</Button>
      <Button onPress={prevPage}>Previous</Button>
    </>
  );
};
```

### Using Auth Context
```javascript
import { useAuth } from '../providers/RootProvider';

export const LoginScreen = () => {
  const { login, isLoading } = useAuth();
  
  const handleLogin = async (phone, password) => {
    await login(userData, token);
    // Navigate to home
  };
};
```

## Implementing API Endpoints

When ready to connect to backend, replace `console.log` in `services/api.js`:

```javascript
// Before (placeholder)
export const workerAPI = {
  getProfile: async (id) => {
    console.log('WORKER: getProfile', id);
    return null;
  },
};

// After (actual implementation)
export const workerAPI = {
  getProfile: async (id) => {
    return apiClient.get(`/api/workers/${id}`);
  },
};
```

## Query Key Convention

Query keys follow hierarchical structure for efficient invalidation:

```javascript
// Single worker
['workers', 'detail', 'worker-id-123']

// Workers list with skip/limit
['workers', 'list', { skip: 0, limit: 10 }]

// Search by skill
['workers', 'search', 'plumbing', { skip: 0, limit: 10 }]

// Worker stats
['workers', 'detail', 'worker-id-123', 'stats']
```

## Performance Tips

1. **Stale Time**: Set longer `staleTime` for rarely-changing data (skills, cities)
   ```javascript
   staleTime: 60 * 60 * 1000 // 1 hour
   ```

2. **Disable Auto-Refetch**: Disabled by default for battery efficiency
   ```javascript
   const { data } = useWorker(id, {
     refetchOnWindowFocus: false,
     refetchOnReconnect: false,
   });
   ```

3. **Prefetch**: Load data before user navigates
   ```javascript
   const prefetch = usePrefetch();
   await prefetch(queryKeys.worker(id), () => workerAPI.getProfile(id));
   ```

4. **Optimistic Updates**: Update UI before API confirms
   ```javascript
   const setData = useSetQueryData();
   setData(queryKeys.worker(id), { ...oldData, ...updates });
   ```

## Environment Setup

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then update with your backend URL:
```env
EXPO_PUBLIC_API_URL=http://your-backend.com
```

## Next Steps

1. ✅ Infrastructure setup complete
2. ⏭️ Implement API endpoints in `services/api.js`
3. ⏭️ Test queries in components
4. ⏭️ Add error boundaries and loading UI
5. ⏭️ Implement offline persistence (optional)

## Debugging

Enable React Query DevTools (optional for development):

```bash
npm install @tanstack/react-query-devtools
```

Then add to RootProvider:
```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// In return statement
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/overview)
