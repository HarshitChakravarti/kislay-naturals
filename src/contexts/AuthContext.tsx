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
  register: (username: string, email: string, password: string, csrfToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearVerification: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to prevent hydration mismatch
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

      if (response.ok) {
        const data = await response.json();
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
      } else if (response.status === 401 || response.status === 404) {
        // User is not authenticated or not found
        clearAuthData();
      } else {
        // Handle other errors
        console.error('Auth check failed with status:', response.status);
        clearAuthData();
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

  // Initialize user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const localUser = JSON.parse(savedUser);
          setUser(localUser);
        } catch (e) {
          console.error('Error parsing stored user:', e);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only check with server if we have a user from localStorage but no current user state
    // This means we need to validate the stored user with the server
    const shouldValidateWithServer = !user && typeof window !== 'undefined' && localStorage.getItem('user');
    
    if (shouldValidateWithServer) {
      checkAuth();
    }
  }, []); // Run only once on mount

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
      
      // Show success message with username
      const displayName = userData.username || userData.name || userData.email?.split('@')[0] || 'User';
      showToast(`Welcome Back! ${displayName}`, 'success');
      
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

  const register = async (username: string, email: string, password: string, csrfToken: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-session-id': 'signup-form',
        },
        body: JSON.stringify({ 
          name: username, // Changed from username to name to match API expectation
          email, 
          password, 
          csrfToken 
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

      // After successful registration, redirect to login page
      router.push('/login?registered=true');
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
      
      // Show success message
      showToast('Successfully signed out!', 'success');
      
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
        <div className="fixed top-4 right-4 z-50 space-y-3">
          {toasts.map((toast, index) => {
            const isWelcomeMessage = toast.message.startsWith('Welcome Back!');
            return (
              <div
                key={toast.id}
                className={`max-w-sm w-full border rounded-xl shadow-xl p-4 transform transition-all duration-500 ease-out animate-in slide-in-from-right-2 fade-in ${
                  toast.type === 'success' 
                    ? isWelcomeMessage
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-900 shadow-green-200/50'
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: 'translateX(0)',
                }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      toast.type === 'success' 
                        ? isWelcomeMessage
                          ? 'bg-green-500 animate-pulse'
                          : 'bg-green-100 animate-pulse'
                        : 'bg-red-100 animate-pulse'
                    }`}>
                      {toast.type === 'success' ? (
                        <svg className={`h-4 w-4 ${isWelcomeMessage ? 'text-white' : 'text-green-600'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 ml-3">
                    <p className={`font-semibold ${isWelcomeMessage ? 'text-base' : 'text-sm'}`}>
                      {toast.message}
                    </p>
                    {isWelcomeMessage && (
                      <p className="text-xs text-green-700 mt-1 font-medium">
                        You're all set! 🎉
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="ml-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
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
