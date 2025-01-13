import React, { useState } from "react";
import AuthTemplate from "../../templates/AuthTemplate";
import CustomInput from "../../components/CustomInput";
import { Link } from "react-router-dom";

const Login = () => {
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const ctaButtonHandler = async () => {
    try {
    } catch (error: any) {}
  };

  return (
    <AuthTemplate
      title="Log Into Your Account"
      ctaButtonText="Log into my account"
      onClickCTAButton={ctaButtonHandler}
      redirectText={(textStyle, linkStyle) => (
        <p className={textStyle}>
          Don't have an account?{" "}
          <Link className={linkStyle} to={"/auth/register"}>
            Register
          </Link>
        </p>
      )}
    >
      <CustomInput
        label="Email Address"
        required
        placeholder="Ex: john@example.com"
        value={details.email}
        type="email"
        onChange={(e) =>
          setDetails((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      <CustomInput
        label="Enter Password"
        required
        placeholder="Enter Password"
        value={details.password}
        type={showPassword ? "text" : "password"}
        onChange={(e) =>
          setDetails((prev) => ({ ...prev, password: e.target.value }))
        }
      />
      <div className="flex items-center justify-between w-full">
        <label
          htmlFor="show-password"
          className="flex items-center gap-2 select-none"
        >
          <input
            type="checkbox"
            name="show-password"
            id="show-password"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show Password
        </label>
      </div>
    </AuthTemplate>
  );
};

export default Login;
