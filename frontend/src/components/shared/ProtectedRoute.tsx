import { useAuth } from '../../providers/AuthProvider';
import { Navigate } from "react-router-dom";
import Navbar from '../layout/Navbar';

export const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <Navbar />;
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};