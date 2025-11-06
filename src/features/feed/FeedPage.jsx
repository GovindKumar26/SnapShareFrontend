import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { logout } from '../auth/authSlice';

const FeedPage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to clear cookies
      await api.post('/logout');
      
      // Clear Redux state
      dispatch(logout());
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if backend call fails, clear local state
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Your Feed
            </h1>
            <p className="text-gray-600 mt-2">
              Hello, {user?.username || user?.displayName}! 👋
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            🎉 You're logged in and this route is protected!
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            Feed content will go here...
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
