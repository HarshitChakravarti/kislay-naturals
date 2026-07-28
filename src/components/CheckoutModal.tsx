'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  variantSize?: string;
}

export default function CheckoutModal({ isOpen, onClose, product, quantity, variantSize }: CheckoutModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Only pass IDs and display metadata — never prices.
      // The checkout page fetches real prices server-side.
      const params = new URLSearchParams({
        productId: product.id.toString(),
        productName: product.name,
        productImage: product.image,
        productDescription: product.description || '',
        quantity: quantity.toString()
      });

      if (variantSize) {
        params.set('variantSize', variantSize);
      }

      router.push(`/checkout?${params.toString()}`);
      onClose();
    }
  }, [isOpen, product, quantity, variantSize, router, onClose]);

  return null;
}