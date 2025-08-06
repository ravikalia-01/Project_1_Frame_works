import { QueryClient } from '@tanstack/react-query'

// Create a custom query client with advanced configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error)
      },
    },
  },
})

// Custom hooks for common patterns
export const queryKeys = {
  resumes: {
    all: ['resumes'],
    list: (filters) => ['resumes', 'list', filters],
    detail: (id) => ['resumes', 'detail', id],
    user: (userId) => ['resumes', 'user', userId],
  },
  templates: {
    all: ['templates'],
    detail: (id) => ['templates', id],
  },
  user: {
    profile: ['user', 'profile'],
    settings: ['user', 'settings'],
  },
}
