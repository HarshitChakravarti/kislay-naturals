'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PaymentProcessing from '@/components/PaymentProcessing';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isLoadingOrderNumber, setIsLoadingOrderNumber] = useState(false);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    setOrderId(orderIdParam);
    
    // Fetch order number if orderId is available
    if (orderIdParam) {
      fetchOrderNumber(orderIdParam);
    }
    
    // Simulate processing time and then redirect to order success page
    const timer = setTimeout(() => {
      setIsProcessing(false);
      
      // Redirect to order success page after a short delay
      setTimeout(() => {
        router.push(`/order-success?orderId=${orderIdParam}`);
      }, 2000);
    }, 3000); // Show processing for 3 seconds

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  const fetchOrderNumber = async (orderId: string) => {
    setIsLoadingOrderNumber(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/order-number`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.order_number) {
          setOrderNumber(data.data.order_number);
        }
      }
    } catch (error) {
      console.error('Failed to fetch order number:', error);
    } finally {
      setIsLoadingOrderNumber(false);
    }
  };

  return (
    <PaymentProcessing 
      orderId={orderId}
      orderNumber={orderNumber}
      isProcessing={isProcessing}
      isLoadingOrderNumber={isLoadingOrderNumber}
    />
  );
}
