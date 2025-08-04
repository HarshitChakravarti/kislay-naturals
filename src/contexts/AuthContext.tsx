'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserData } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isVerifying: boolean;
  error: string | null;
  login: (emailOrUsername: string, password: string, callbackUrl?: string) => Promise<UserData | undefined>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearVerification: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    // Initialize user from localStorage if available
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false); // Start with false since we check localStorage first
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false); // Prevent multiple simultaneous checks
  const router = useRouter();

  // Centralized function to clear auth data
  const clearAuthData = useCallback(() => {
    setUser(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }, []);

  const checkAuth = useCallback(async (forceCheck = false) => {
    // Skip if already checking or already have a user (unless force check)
    if ((isCheckingAuth && !forceCheck) || (user && !forceCheck)) return;
    
    // Check localStorage first for immediate UI update
    if (!user && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const localUser = JSON.parse(storedUser);
          setUser(localUser);
          // If we have a local user and this is not a force check, don't validate with server
          if (localUser && !forceCheck) return;
        } catch (e) {
          console.error('Error parsing stored user:', e);
          localStorage.removeItem('user');
        }
      }
    }
    
    // Only set loading if we actually need to check with the server
    setIsCheckingAuth(true);
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we have a user in localStorage for immediate UI update
      let localUser = null;
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            localUser = JSON.parse(storedUser);
            // Only set the local user if we don't have a user or if forced
            if (!user || forceCheck) {
              setUser(localUser);
            }
          } catch (e) {
            console.error('Error parsing stored user:', e);
            localStorage.removeItem('user');
          }
        }
      }
      
      // Then validate with the server
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      console.log('Auth check response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Auth check response data:', data);
        if (data.user) {
          // Ensure consistent user data format
          const serverUser = {
            ...data.user,
            _id: data.user._id?.toString() || data.user._id
          };
          
          setUser(serverUser);
          
          // Update localStorage with fresh user data
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(serverUser));
          }
        } else {
          // No valid session found
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
          }
        }
      } else if (response.status === 401) {
        // User is not authenticated or token is invalid
        console.log('User not authenticated or token invalid - clearing all data');
        clearAuthData();
        // The server should have already cleared the invalid cookie
      } else if (response.status === 404) {
        // User not found in database
        console.log('User not found in database - clearing all data');
        clearAuthData();
        // The server should have already cleared the invalid cookie
      } else {
        // Handle other errors
        console.error('Auth check failed with status:', response.status);
        clearAuthData();
        
        // If we had a local user but server validation failed, clear the session
        if (localUser) {
          console.log('Server validation failed, clearing local session');
          // Optionally try to logout to clear any invalid tokens
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include'
            });
          } catch (e) {
            console.error('Error during logout after failed validation:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setError('Failed to check authentication status');
      // On error, clear all auth data to show login options
      clearAuthData();
    } finally {
      setIsLoading(false);
      setIsCheckingAuth(false);
    }
  }, [user, isCheckingAuth, clearAuthData]);

  useEffect(() => {
    // Only check with server if we have a user from localStorage but no current user state
    // This means we need to validate the stored user with the server
    const shouldValidateWithServer = !user && typeof window !== 'undefined' && localStorage.getItem('user');
    
    if (shouldValidateWithServer) {
      // Initial check with timeout
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.log('Auth check timeout - forcing loading to false');
          setIsLoading(false);
          clearAuthData();
        }
      }, 5000); // 5 second timeout

      checkAuth();

      return () => {
        clearTimeout(timeoutId);
      };
    }

    // Set up periodic check every 10 minutes (less frequent)
    const intervalId = setInterval(() => {
      // Only check if user is logged in
      if (user) {
        checkAuth(true);
      }
    }, 10 * 60 * 1000);

    // Check when the page becomes visible again (only if user is logged in)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        checkAuth(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAuth, isLoading, user, clearAuthData]);

  const login = async (emailOrUsername: string, password: string, callbackUrl = '/') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get CSRF token first
      const csrfResponse = await fetch('/api/auth/login', {
        method: 'GET',
        headers: {
          'x-session-id': 'auth-context',
        },
      });
      const csrfData = await csrfResponse.json();
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-session-id': 'auth-context',
        },
        body: JSON.stringify({ 
          emailOrUsername, 
          password, 
          csrfToken: csrfData.csrfToken 
        }),
        credentials: 'include',
      });

      // First check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid server response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      if (!data.user) {
        throw new Error('No user data received');
      }

      // Update the user state
      const userData = {
        ...data.user,
        _id: data.user._id?.toString() || data.user._id,
      };
      
      setUser(userData);
      setIsVerifying(true);
      
      // Store user data in localStorage for initial client-side hydration
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Show verification state for a moment before redirecting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      showToast('Login successful! Welcome back.', 'success');
      
      // Redirect to the callback URL or home page
      router.push(callbackUrl);
      
      // Reset verification state after a short delay
      setTimeout(() => {
        setIsVerifying(false);
      }, 1000);
      
      return userData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Login error:', error);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get CSRF token first
      const csrfResponse = await fetch('/api/auth/signup', {
        method: 'GET',
        headers: {
          'x-session-id': 'auth-context',
        },
      });
      const csrfData = await csrfResponse.json();
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-session-id': 'auth-context',
        },
        body: JSON.stringify({ 
          username, 
          email, 
          password, 
          csrfToken: csrfData.csrfToken 
        }),
        credentials: 'include',
      });

      // First check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid server response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // Show success message
      showToast('Registration successful! Welcome to Kislay Naturals.', 'success');
      
      // After successful registration, log the user in
      return login(username, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Registration error:', error);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear user data from state and localStorage first for immediate UI update
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      // Call the logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Redirect to login page
      router.push('/login');
      router.refresh(); // Ensure the page is refreshed to clear any cached data
      
      return Promise.resolve();
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to log out. Please try again.');
      return Promise.reject(error);
    }
  };

  const clearVerification = () => setIsVerifying(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const value = {
    user,
    isLoading,
    isVerifying,
    error,
    login,
    register,
    logout,
    clearVerification: () => setIsVerifying(false),
    showToast
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 ${
                toast.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
