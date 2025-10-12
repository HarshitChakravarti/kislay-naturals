'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserData } from '@/types';
import { SessionManager } from '@/lib/auth/sessionManager';

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
  checkAuth: (forceCheck?: boolean) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  handleTokenExpiration: () => void;
  isAdmin: () => boolean;
  validateAdminAccess: () => { isValid: boolean; error?: string };
  getUserRole: () => string;
  validateServerAuth: () => Promise<{ success: boolean; user?: UserData; error?: string }>;
  // Session management
  sessionManager: SessionManager | null;
  sessionState: {
    isActive: boolean;
    timeUntilExpiry: number;
    inactivityTime: number;
    warningShown: boolean;
  };
  extendSession: () => Promise<boolean>;
  initializeSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with true to prevent hydration mismatch
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false); // Prevent multiple simultaneous checks
  const [sessionManager, setSessionManager] = useState<SessionManager | null>(null);
  const sessionManagerRef = useRef<SessionManager | null>(null);
  const [sessionState, setSessionState] = useState({
    isActive: false,
    timeUntilExpiry: 0,
    inactivityTime: 0,
    warningShown: false
  });
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
    // Prevent multiple simultaneous checks unless it's a forced check
    if (isCheckingAuth && !forceCheck) {
      return;
    }
    
    // Add debouncing to prevent excessive API calls (reduced from 30 seconds)
    const now = Date.now();
    const lastCheck = localStorage.getItem('lastAuthCheck');
    const timeSinceLastCheck = lastCheck ? now - parseInt(lastCheck) : Infinity;
    
    // If not a forced check and we checked recently (within 5 seconds), skip
    if (!forceCheck && timeSinceLastCheck < 5000) {
      return;
    }
    
    setIsCheckingAuth(true);
    if (!user || forceCheck) {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      clearTimeout(timeoutId);

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
            localStorage.setItem('lastAuthCheck', now.toString());
          }
        } else {
          // No valid session found
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('lastAuthCheck');
          }
        }
      } else if (response.status === 401 || response.status === 404) {
        // User is not authenticated or not found
        console.log('Auth check failed: User not authenticated');
        
        // Try to refresh token before giving up (but only once)
        if (user && !forceCheck) {
          console.log('Attempting token refresh...');
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            console.log('Token refresh successful, retrying auth check');
            // Retry the auth check after successful refresh
            return checkAuth(true);
          }
        }
        
        clearAuthData();
        // If this was a forced check and we had a user before, show expiration message
        if (forceCheck && user) {
          handleTokenExpiration();
        }
      } else {
        // Handle other errors
        console.error('Auth check failed with status:', response.status);
        clearAuthData();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      
      // Handle timeout and network errors gracefully
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('Auth check timed out');
          setError('Authentication check timed out. Please try again.');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.log('Network error during auth check');
          setError('Network error. Please check your connection.');
        } else {
          setError('Failed to check authentication status');
        }
      } else {
        setError('Failed to check authentication status');
      }
      
      // On error, clear all auth data to show login options
      clearAuthData();
    } finally {
      setIsLoading(false);
      setIsCheckingAuth(false);
      setIsInitialized(true);
    }
  }, [user, isCheckingAuth, clearAuthData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize with server-first validation (reduced localStorage dependency)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only use localStorage for initial UI state, always validate with server
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
      
      // Always validate with server on mount for accurate state
      checkAuth(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add periodic token validation for admin users (reduced frequency)
  useEffect(() => {
    if (user && user.role === 'admin') {
      // Set up periodic validation for admin users to catch expired tokens
      const interval = setInterval(() => {
        checkAuth(true);
      }, 10 * 60 * 1000); // Check every 10 minutes (increased from 5)

      return () => clearInterval(interval);
    }
  }, [user?.role, user]); // eslint-disable-line react-hooks/exhaustive-deps

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
        localStorage.removeItem('lastAuthCheck'); // Clear auth check cache to allow immediate validation
      }
      
      // Show verification state for a moment before redirecting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message with username
      const displayName = userData.username || userData.name || userData.email?.split('@')[0] || 'User';
      showToast(`Welcome Back! ${displayName}`, 'success');
      
      // Force a fresh authentication check to ensure the session is properly established
      await checkAuth(true);
      
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
      // Clear session manager first
      if (sessionManager) {
        sessionManager.destroy();
        setSessionManager(null);
      }
      
      // Clear user data from state and localStorage first for immediate UI update
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      
      // Clear session state
      setSessionState({
        isActive: false,
        timeUntilExpiry: 0,
        inactivityTime: 0,
        warningShown: false
      });
      
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

  // Add method to handle token expiration gracefully
  const handleTokenExpiration = useCallback(() => {
    console.log('Token expired, clearing auth data');
    clearAuthData();
    showToast('Your session has expired. Please log in again.', 'error');
    router.push('/login');
  }, [clearAuthData, showToast, router]);

  // Enhanced token refresh method
  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
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
        if (data.success && data.user) {
          const serverUser = {
            ...data.user,
            _id: data.user._id?.toString() || data.user._id
          };
          setUser(serverUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(serverUser));
          }
          console.log('Token refreshed successfully');
          return true;
        }
      } else if (response.status === 401) {
        // Token is invalid, clear auth data
        console.log('Token refresh failed - clearing auth data');
        clearAuthData();
        return false;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [clearAuthData]);

  // Admin role validation methods
  const isAdmin = useCallback(() => {
    if (!user) return false;
    return user.role === 'admin';
  }, [user]);

  const validateAdminAccess = useCallback(() => {
    if (!user) {
      return { isValid: false, error: 'User not authenticated' };
    }
    
    if (user.role !== 'admin') {
      return { isValid: false, error: `User role '${user.role}' is not admin` };
    }
    
    return { isValid: true };
  }, [user]);

  const getUserRole = useCallback(() => {
    if (!user) return 'guest';
    return user.role || 'user';
  }, [user]);

  // Server-side validation method that bypasses localStorage
  const validateServerAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
          const serverUser = {
            ...data.user,
            _id: data.user._id?.toString() || data.user._id
          };
          
          setUser(serverUser);
          
          // Update localStorage only after successful server validation
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(serverUser));
          }
          
          return { success: true, user: serverUser };
        }
      }
      
      // Clear auth data on server validation failure
      clearAuthData();
      return { success: false, error: 'Server validation failed' };
    } catch (error) {
      console.error('Server auth validation error:', error);
      clearAuthData();
      return { success: false, error: 'Server validation error' };
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  // Session management methods
  const initializeSession = useCallback(async (): Promise<boolean> => {
    if (sessionManager) {
      return await sessionManager.initializeSession();
    }
    return false;
  }, [sessionManager]);

  const extendSession = useCallback(async (): Promise<boolean> => {
    if (sessionManager) {
      return await sessionManager.refreshSession();
    }
    return false;
  }, [sessionManager]);

  // Initialize session manager when user is authenticated (with debouncing)
  useEffect(() => {
    if (user && !sessionManagerRef.current && user.email) {
      console.log('Initializing session manager for user:', user.email);
      
      // Add minimal debouncing to prevent multiple initializations
      const initTimeout = setTimeout(() => {
        // Validate user authentication before initializing session manager
        const validateUser = async () => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch('/api/auth/me', {
              credentials: 'include',
              cache: 'no-store',
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              console.log('User validation failed, clearing user data');
              clearAuthData();
              return false;
            }
            
            return true;
          } catch (error) {
            console.error('User validation error:', error);
            clearAuthData();
            return false;
          }
        };
        
        validateUser().then(isValid => {
          if (!isValid) return;
          
          const manager = new SessionManager(
          {
            refreshInterval: 15 * 60 * 1000, // 15 minutes (increased from 10)
            warningTime: 5 * 60 * 1000, // 5 minutes before expiry
            maxInactivity: 30 * 60 * 1000, // 30 minutes
            extendOnActivity: true
          },
          {
            onSessionExpired: () => {
              console.log('Session expired');
              clearAuthData();
              showToast('Your session has expired. Please log in again.', 'error');
              router.push('/login');
            },
            onSessionWarning: () => {
              console.log('Session warning triggered');
              setSessionState(prev => ({ ...prev, warningShown: true }));
            },
            onSessionRefreshed: (newToken) => {
              console.log('Session refreshed');
              setSessionState(prev => ({ ...prev, warningShown: false }));
              // Don't show success toast for automatic refreshes
            },
            onSessionError: (error) => {
              console.error('Session error:', error);
              // Only show error toast for critical errors, not network timeouts
              if (!error.includes('timed out') && !error.includes('Network error')) {
                showToast('Session error occurred', 'error');
              }
            }
          }
        );

        sessionManagerRef.current = manager;
        setSessionManager(manager);
        
          // Initialize session with error handling
          manager.initializeSession().then(success => {
            if (!success) {
              console.log('Session initialization failed, clearing user data');
              clearAuthData();
            } else {
              console.log('Session manager initialized successfully');
            }
          }).catch(error => {
            console.error('Session initialization error:', error);
            clearAuthData();
          });
        });
      }, 100); // 100ms debounce (reduced from 1000ms)
      
      return () => clearTimeout(initTimeout);
    } else if (!user && sessionManagerRef.current) {
      sessionManagerRef.current.destroy();
      sessionManagerRef.current = null;
      setSessionManager(null);
      setSessionState({
        isActive: false,
        timeUntilExpiry: 0,
        inactivityTime: 0,
        warningShown: false
      });
    }
  }, [user?.email, sessionManager, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update session state periodically (reduced frequency)
  useEffect(() => {
    if (!sessionManager) return;

    const interval = setInterval(() => {
      const state = sessionManager.getSessionState();
      setSessionState({
        isActive: state.isActive,
        timeUntilExpiry: sessionManager.getTimeUntilExpiry(),
        inactivityTime: sessionManager.getInactivityTime(),
        warningShown: state.warningShown
      });
    }, 10000); // Reduced from 5000ms to 10000ms (10 seconds)

    return () => clearInterval(interval);
  }, [sessionManager]);

  // Cleanup session manager on unmount
  useEffect(() => {
    return () => {
      if (sessionManager) {
        sessionManager.destroy();
      }
    };
  }, [sessionManager]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const value = {
    user,
    isLoading: isLoading && !isInitialized, // Only show loading if not initialized
    isVerifying,
    error,
    login,
    register,
    logout,
    clearVerification: () => setIsVerifying(false),
    showToast,
    checkAuth,
    refreshToken,
    handleTokenExpiration,
    isAdmin,
    validateAdminAccess,
    getUserRole,
    validateServerAuth,
    sessionManager,
    sessionState,
    extendSession,
    initializeSession
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
                        You&apos;re all set! 🎉
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