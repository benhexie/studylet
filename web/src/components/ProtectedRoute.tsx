import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
