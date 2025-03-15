import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import AuthTemplate from "../../templates/AuthTemplate";
import {
  useLoginMutation,
  useGoogleCallbackMutation,
} from "../../store/api/authApi";
import { toast } from "react-toastify";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [login, { isLoading }] = useLoginMutation();
  const [googleCallback] = useGoogleCallbackMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  // Get the redirect path from location state
  const from = location.state?.from || "/app/dashboard";

  // Combine the OAuth callback handling into a single useEffect
  useEffect(() => {
    // Handle Google OAuth code
    const code = searchParams.get("code");
    if (code) {
      console.log("Received OAuth code:", code);
      handleGoogleCallback(code);
      return; // Exit early if handling OAuth code
    }

    // Handle auth data from redirect
    const authData = searchParams.get("authData");
    if (authData) {
      try {
        console.log("Received auth data from redirect");
        const parsedData = JSON.parse(decodeURIComponent(authData));
        dispatch(setCredentials(parsedData));
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Failed to parse auth data:", error);
        toast.error("Authentication failed");
      }
      return;
    }

    // Handle errors
    const error = searchParams.get("error");
    if (error === "auth_failed") {
      toast.error("Google authentication failed");
    } else if (error === "server_error") {
      toast.error("Server error occurred");
    }
  }, [searchParams, dispatch, navigate, from]);

  const handleGoogleCallback = async (code: string) => {
    try {
      console.log("Calling googleCallback with code:", code);
      const result = await googleCallback({ code }).unwrap();
      console.log("Google callback result:", result);
      // The redirect will happen automatically from the backend
    } catch (error: any) {
      console.error("Google callback error:", error);
      toast.error(error.data?.message || "Google login failed");
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${process.env.REACT_APP_API_BASE_URL}/api/auth/google`;
    console.log("Redirecting to Google Auth:", googleAuthUrl);
    window.location.href = googleAuthUrl;
  };

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
      // Redirect to the page they tried to visit or dashboard
      navigate(from, { replace: true });
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
          <Link to="/auth/register" replace className={linkStyle}>
            Sign up
          </Link>
        </p>
      )}
    >
      <div className="flex flex-col gap-4">
        {/* <GoogleAuthButton onClick={handleGoogleLogin} isLoading={isLoading} />
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gray-300" />
          <span className="text-gray-500">or</span>
          <div className="flex-1 h-[1px] bg-gray-300" />
        </div> */}
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
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Forgot Password?
        </Link>
      </div>
    </AuthTemplate>
  );
};

export default Login;
