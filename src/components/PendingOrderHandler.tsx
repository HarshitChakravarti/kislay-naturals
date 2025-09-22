'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface PendingOrderHandlerProps {
  onOpenCheckout: (productId: string, quantity: number) => void;
}

export default function PendingOrderHandler({ onOpenCheckout }: PendingOrderHandlerProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run this effect when user authentication is complete
    if (isLoading) return;

    // Check if there's a pending order after login
    if (user && typeof window !== 'undefined') {
      const pendingOrder = localStorage.getItem('pendingOrder');
      
      if (pendingOrder) {
        try {
          const { productId, quantity, returnUrl } = JSON.parse(pendingOrder);
          
          // Clear the pending order
          localStorage.removeItem('pendingOrder');
          
          // Navigate back to the product page if needed
          if (returnUrl && returnUrl !== window.location.pathname) {
            router.push(returnUrl);
          }
          
          // Open the checkout modal after a short delay to ensure the page is loaded
          setTimeout(() => {
            onOpenCheckout(productId, quantity);
          }, 500);
          
        } catch (error) {
          console.error('Error processing pending order:', error);
          localStorage.removeItem('pendingOrder');
        }
      }
    }
  }, [user, isLoading, onOpenCheckout, router]);

  // This component doesn't render anything
  return null;
}
