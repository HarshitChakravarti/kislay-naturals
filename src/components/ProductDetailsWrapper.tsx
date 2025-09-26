'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Product } from '@/types';
import CheckoutModal from './CheckoutModal';
import ClientOnly from './ClientOnly';

const ProductDetails = dynamic(
  () => import('./ProductDetails1'),
  { ssr: false }
);

interface ProductDetailsWrapperProps {
  product: Product;
}

export default function ProductDetailsWrapper({ product }: ProductDetailsWrapperProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);

  const handleOpenCheckout = (productId: string, quantity: number) => {
    // Only open if it's for the current product
    if (productId === product.id.toString()) {
      setCheckoutQuantity(quantity);
      setIsCheckoutOpen(true);
    }
  };

  return (
    <>
      <ProductDetails 
        product={product} 
        onOpenCheckout={(quantity) => {
          setCheckoutQuantity(quantity);
          setIsCheckoutOpen(true);
        }}
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={product} 
        quantity={checkoutQuantity} 
      />
    </>
  );
}
