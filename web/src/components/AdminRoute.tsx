import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';

const AdminRoute = () => {
  const user = useSelector(selectUser);
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 