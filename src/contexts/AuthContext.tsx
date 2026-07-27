'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserData } from '@/types';
import { createClient } from '@/utils/supabase/client';

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
  logout: () => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
  isAdmin: () => boolean;
  getUserRole: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const clearAuthData = useCallback(() => {
    setUser(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          const userData = {
            _id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email!,
            role: session.user.user_metadata?.role || 'user',
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const userData = {
            _id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email!,
            role: session.user.user_metadata?.role || 'user',
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else if (event === 'SIGNED_OUT') {
        clearAuthData();
        router.refresh();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router, clearAuthData]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      clearAuthData();
      showToast('Successfully logged out', 'success');
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      showToast(err.message || 'Failed to logout', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router, showToast, clearAuthData]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  const getUserRole = useCallback(() => {
    return user?.role || 'guest';
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isVerifying,
        error,
        logout,
        showToast,
        isAdmin,
        getUserRole
      }}
    >
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-md shadow-lg ${
                toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {toast.message}
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