import { useAuth } from '../context/AuthContext';

// Custom hook for authentication
export const useAuthHook = () => {
  return useAuth();
};

// Custom hook for authentication status
export const useAuthStatus = () => {
  const { isAuthenticated, loading, user } = useAuth();
  return { isAuthenticated, loading, user };
};
