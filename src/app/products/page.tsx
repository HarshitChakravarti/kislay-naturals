import { Suspense } from 'react';
import Loading from '../loading';
import ProductsList from "./ProductsList";

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsList />
    </Suspense>
  );
}
