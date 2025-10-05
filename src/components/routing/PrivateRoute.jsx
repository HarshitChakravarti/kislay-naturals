import { Navigate } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ClientOnly from '@/components/ClientOnly';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function PrivateRouteWrapper({ children }) {
  return (
    <ClientOnly>
      <PrivateRoute>{children}</PrivateRoute>
    </ClientOnly>
  );
}
