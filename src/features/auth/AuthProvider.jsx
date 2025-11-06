import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../api/axios';
import { setUser } from './authSlice';

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/auth/me');
        
        if (import.meta.env.DEV) {
          console.log("Session restored:", res.data.user);
        }
        
        dispatch(setUser(res.data.user));
      } catch (err) {
        // No valid session, user not logged in
        if (import.meta.env.DEV) {
          console.log("No active session");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    // Show loading spinner while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
