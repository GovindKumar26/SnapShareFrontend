import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);

  // If no user in Redux, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedRoute;
