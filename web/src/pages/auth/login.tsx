import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthTemplate from "../../templates/AuthTemplate";
import { useLoginMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await login(formData).unwrap();
      navigate("/app/dashboard");
    } catch (error: any) {
      toast.error(error.data?.message || "Login failed");
    }
  };

  return (
    <AuthTemplate
      title="Welcome Back"
      ctaButtonText="Sign In"
      onClickCTAButton={handleLogin}
      isLoading={isLoading}
      redirectText={(textStyle, linkStyle) => (
        <p className={textStyle}>
          Don't have an account?{" "}
          <Link to="/auth/register" className={linkStyle}>
            Sign up
          </Link>
        </p>
      )}
    >
      <div className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="p-4 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className="p-4 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <Link
          to="/auth/forgot-password"
          className={`text-sm text-blue-600 font-medium self-end ${
            isLoading ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          Forgot Password?
        </Link>
      </div>
    </AuthTemplate>
  );
};

export default Login;
