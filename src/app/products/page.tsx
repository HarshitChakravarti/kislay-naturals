"use client";
import { Suspense } from 'react';
import ProductsList from "./ProductsList";
import Loading from '../loading';

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsList />
    </Suspense>
  );
}
