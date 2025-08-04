// import { Navigate } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  // const location = useLocation();

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && !loading && user && user.role !== 'admin') {
    toast.error('Not authorized as an admin');
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
