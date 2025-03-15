import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthTemplate from "../../templates/AuthTemplate";
import { useForgotPasswordMutation } from "../../store/api/authApi";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send reset instructions");
    }
  };

  return (
    <AuthTemplate
      title="Reset Password"
      ctaButtonText="Send Reset Instructions"
      onClickCTAButton={handleSubmit}
      isLoading={isLoading}
      redirectText={(textStyle, linkStyle) => (
        <p className={textStyle}>
          Remember your password?{" "}
          <Link to="/auth/login" replace className={linkStyle}>
            Sign in
          </Link>
        </p>
      )}
    >
      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="p-4 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </AuthTemplate>
  );
};

export default ForgotPassword;
