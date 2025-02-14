import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useResetPasswordMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";
import AuthTemplate from "../../templates/AuthTemplate";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        token: searchParams.get("token")!,
        password,
      }).unwrap();

      toast.success("Password reset successfully");
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to reset password");
    }
  };

  return (
    <AuthTemplate
      title="Reset Password"
      ctaButtonText="Reset Password"
      onClickCTAButton={handleSubmit}
      isLoading={isLoading}
      redirectText={() => (
        <Link to="/auth/login">
          <span className="text-primary">Login</span>
        </Link>
      )}
    >
      <div className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-4 rounded-lg border border-gray-300"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-4 rounded-lg border border-gray-300"
        />
      </div>
    </AuthTemplate>
  );
};

export default ResetPassword;
