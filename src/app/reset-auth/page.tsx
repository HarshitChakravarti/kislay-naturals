'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ClientOnly from '@/components/ClientOnly';

function ResetAuthPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const resetAuth = async () => {
      try {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
        
        // Call logout API
        await logout();
        
        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('Error resetting auth:', error);
        // Still redirect even if logout fails
        router.push('/');
      }
    };

    resetAuth();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Resetting authentication state...</p>
      </div>
    </div>
  );
}

export default function ResetAuthPageWrapper() {
  return (
    <ClientOnly>
      <ResetAuthPage />
    </ClientOnly>
  );
} 