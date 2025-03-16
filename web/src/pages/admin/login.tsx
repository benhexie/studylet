import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../../store/api/adminApi";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import { setCredentials } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import { AppDispatch } from "../../store/store";
import AuthTemplate from "../../templates/AuthTemplate";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [credentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await adminLogin(credentials).unwrap();
      if (!result.user) {
        toast.error("Invalid admin credentials");
        return;
      }
      if (result.user.role !== "admin") {
        toast.error("Invalid admin credentials");
        return;
      }

      // Update auth state with proper typing
      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
        })
      );
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.log(error);
      toast.error(error.data?.message || "Failed to login");
    }
  };

  return (
    <AuthTemplate
      title="Admin Login"
      ctaButtonText={isLoading ? "Signing in..." : "Sign in"}
      onClickCTAButton={handleSubmit}
      isLoading={isLoading}
      imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      redirectText={() => null}
    >
      <div className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={credentials.email}
          onChange={(e) =>
            setLoginCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={isLoading}
          className="p-4 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setLoginCredentials((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          disabled={isLoading}
          className="p-4 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </AuthTemplate>
  );
};

export default AdminLogin;
