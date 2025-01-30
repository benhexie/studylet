import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminLoginMutation } from '../../store/api/adminApi';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { setCredentials } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { AppDispatch } from '../../store/store';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [credentials, setLoginCredentials] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await adminLogin(credentials).unwrap();
      if (!result.user) return toast.error('Invalid admin credentials');
      if (result.user.role !== 'admin') return toast.error('Invalid admin credentials');
      
      // Update auth state with proper typing
      dispatch(setCredentials({
        user: result.user,
        token: result.token
      }));
      navigate('/admin/dashboard');
    } catch (error: any) {
        console.log(error);
        
      toast.error(error.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </span>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 