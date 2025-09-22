import { Navigate } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
