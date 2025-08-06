'use client';

import dynamic from 'next/dynamic';
import type { Product } from '@/types';

const ProductDetails = dynamic(
  () => import('./ProductDetails'),
  { ssr: false }
);

interface ProductDetailsWrapperProps {
  product: Product;
}

export default function ProductDetailsWrapper({ product }: ProductDetailsWrapperProps) {
  return <ProductDetails product={product} />;
}
