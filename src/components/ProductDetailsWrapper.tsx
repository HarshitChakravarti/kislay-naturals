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
  const [checkoutProduct, setCheckoutProduct] = useState<Product>(product);
  const [selectedVariantSize, setSelectedVariantSize] = useState<string>('');

  return (
    <>
      <ProductDetails 
        product={product} 
        onOpenCheckout={(quantity, productWithVariant, variantSize) => {
          setCheckoutQuantity(quantity);
          setCheckoutProduct(productWithVariant || product);
          setSelectedVariantSize(variantSize || '');
          setIsCheckoutOpen(true);
        }}
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={checkoutProduct} 
        quantity={checkoutQuantity}
        variantSize={selectedVariantSize}
      />
    </>
  );
}
