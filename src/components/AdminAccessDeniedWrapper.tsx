'use client';

import { Suspense } from 'react';
import AdminAccessDenied from './AdminAccessDenied';

export default function AdminAccessDeniedWrapper() {
  return (
    <Suspense fallback={null}>
      <AdminAccessDenied />
    </Suspense>
  );
}
