import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { useLogoutMutation } from '../store/api/authApi';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction()); // Clear the auth state
      navigate('/admin/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <MdLogout className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 