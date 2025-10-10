'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ServerAuthState {
  user: any | null;
  isLoading: boolean;
  isValidating: boolean;
  error: string | null;
  lastValidated: number | null;
}

interface UseServerAuthOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectOnFail?: string;
  validateInterval?: number; // in milliseconds
}

export function useServerAuth(options: UseServerAuthOptions = {}) {
  const {
    requireAuth = false,
    requireAdmin = false,
    redirectOnFail = '/login',
    validateInterval = 5 * 60 * 1000 // 5 minutes
  } = options;

  const [state, setState] = useState<ServerAuthState>({
    user: null,
    isLoading: true,
    isValidating: false,
    error: null,
    lastValidated: null
  });

  const router = useRouter();

  const validateWithServer = useCallback(async (force = false) => {
    // Don't validate if already validating unless forced
    if (state.isValidating && !force) return;

    setState(prev => ({ ...prev, isValidating: true, error: null }));

    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setState(prev => ({
            ...prev,
            user: data.user,
            isLoading: false,
            isValidating: false,
            error: null,
            lastValidated: Date.now()
          }));
          return true;
        }
      } else if (response.status === 401) {
        // User is not authenticated
        setState(prev => ({
          ...prev,
          user: null,
          isLoading: false,
          isValidating: false,
          error: 'Not authenticated'
        }));

        if (requireAuth) {
          router.push(redirectOnFail);
        }
        return false;
      } else {
        throw new Error(`Auth validation failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Server auth validation failed:', error);
      setState(prev => ({
        ...prev,
        user: null,
        isLoading: false,
        isValidating: false,
        error: error instanceof Error ? error.message : 'Validation failed'
      }));

      if (requireAuth) {
        router.push(redirectOnFail);
      }
      return false;
    }

    return false;
  }, [state.isValidating, requireAuth, redirectOnFail, router]);

  // Initial validation on mount
  useEffect(() => {
    validateWithServer();
  }, [validateWithServer]);

  // Periodic validation
  useEffect(() => {
    if (!state.user || !validateInterval) return;

    const interval = setInterval(() => {
      const timeSinceLastValidation = Date.now() - (state.lastValidated || 0);
      if (timeSinceLastValidation >= validateInterval) {
        validateWithServer(true);
      }
    }, validateInterval);

    return () => clearInterval(interval);
  }, [state.user, state.lastValidated, validateInterval, validateWithServer]);

  // Admin role validation
  useEffect(() => {
    if (requireAdmin && state.user && !state.isLoading) {
      if (state.user.role !== 'admin') {
        setState(prev => ({
          ...prev,
          error: 'Admin access required',
          user: null
        }));
        router.push('/');
      }
    }
  }, [state.user, requireAdmin, state.isLoading, router]);

  // Force validation method
  const forceValidation = useCallback(() => {
    return validateWithServer(true);
  }, [validateWithServer]);

  // Clear auth state
  const clearAuth = useCallback(() => {
    setState({
      user: null,
      isLoading: false,
      isValidating: false,
      error: null,
      lastValidated: null
    });
  }, []);

  return {
    ...state,
    forceValidation,
    clearAuth,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin'
  };
}
