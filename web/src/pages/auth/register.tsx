import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthTemplate from "../../templates/AuthTemplate";
import { useRegisterMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
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
          <Link to="/auth/login" className={linkStyle}>
            Sign in
          </Link>
        </p>
      )}
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className="p-4 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
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
