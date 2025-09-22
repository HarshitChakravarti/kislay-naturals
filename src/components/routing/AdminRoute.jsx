import { Navigate } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isLoading, showToast } = useAuth();

  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  if (user && !isLoading && user.role !== 'admin') {
    showToast('Not authorized as an admin', 'error');
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
