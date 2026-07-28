'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { UserData } from '@/types';
import { createClient } from '@/utils/supabase/client';

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isVerifying: boolean;
  error: string | null;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  getUserRole: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();


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
            role: session.user.app_metadata?.role || 'user',
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
            role: session.user.app_metadata?.role || 'user',
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
      toast.success('Successfully logged out');
      router.push('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error(err.message || 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router, clearAuthData]);

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
        isAdmin,
        getUserRole
      }}
    >
      {children}
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