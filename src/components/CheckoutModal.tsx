'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
}

export default function CheckoutModal({ isOpen, onClose, product, quantity }: CheckoutModalProps) {
  const router = useRouter();

  // Redirect to checkout page when modal opens
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams({
        productId: product.id.toString(),
        productName: product.name,
        productPrice: product.price.toString(),
        productImage: product.image,
        productDescription: product.description || '',
        quantity: quantity.toString()
      });
      
      router.push(`/checkout?${params.toString()}`);
      onClose(); // Close the modal after redirect
    }
  }, [isOpen, product, quantity, router, onClose]);

  // This component doesn't render anything as it just redirects
  return null;
}