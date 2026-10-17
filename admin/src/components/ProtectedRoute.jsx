import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/**
 * Route protection wrapper for the Admin panel.
 * If the user is not authenticated as an admin, redirects them directly to /login.
 */
export default function ProtectedRoute({ children }) {
  const { isAdmin } = useAdminAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/sc-portal/access" state={{ from: location }} replace />;
  }

  return children;
}
