import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthTemplate from "../../templates/AuthTemplate";
import {
  useRegisterMutation,
  useGoogleCallbackMutation,
} from "../../store/api/authApi";
import { toast } from "react-toastify";
import GoogleAuthButton from "../../components/GoogleAuthButton";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [register, { isLoading }] = useRegisterMutation();
  const [googleCallback] = useGoogleCallbackMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Handle Google OAuth callback
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleGoogleCallback(code);
    }
  }, [searchParams]);

  const handleGoogleCallback = async (code: string) => {
    try {
      await googleCallback({ code }).unwrap();
      navigate("/app/dashboard");
    } catch (error: any) {
      toast.error(error.data?.message || "Google signup failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/api/auth/google`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await register(formData).unwrap();
      navigate("/app/dashboard");
    } catch (error: any) {
      toast.error(error.data?.message || "Registration failed");
    }
  };

  return (
    <AuthTemplate
      title="Create Account"
      ctaButtonText="Sign Up"
      onClickCTAButton={handleRegister}
      isLoading={isLoading}
      redirectText={(textStyle, linkStyle) => (
        <p className={textStyle}>
          Already have an account?{" "}
          <Link to="/auth/login" replace className={linkStyle}>
            Sign in
          </Link>
        </p>
      )}
    >
      <div className="flex flex-col gap-4">
        {/* <GoogleAuthButton onClick={handleGoogleSignup} isLoading={isLoading} />
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gray-300" />
          <span className="text-gray-500">or</span>
          <div className="flex-1 h-[1px] bg-gray-300" />
        </div> */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
            className="p-4 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
            className="p-4 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
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
      </div>
    </AuthTemplate>
  );
};

export default Register;
