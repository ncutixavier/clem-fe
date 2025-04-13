'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { UserCredentials, UserProfile } from '@/models/user';
import { authenticateUser, getCurrentUser } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface AuthResponse {
  user: UserProfile;
  token: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize token from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
      }
      setIsInitialized(true);
    }
  }, []);

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!token) return null;
      return getCurrentUser(token);
    },
    enabled: !!token && isInitialized,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: UserCredentials) => {
      const response = await authenticateUser(credentials);
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    },
  });

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    router.push('/auth/login');
  };

  return {
    user,
    isAuthenticated: !!token && !!user,
    isLoading: !isInitialized || isLoadingUser || loginMutation.isPending,
    login: loginMutation.mutate,
    logout,
    error: loginMutation.error,
  };
}; 