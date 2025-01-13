import React, { useState } from "react";
import AuthTemplate from "../../templates/AuthTemplate";
import CustomInput from "../../components/CustomInput";
import { Link } from "react-router-dom";

const Register = () => {
  const [details, setDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const ctaButtonHandler = async () => {
    try {
    } catch (error: any) {}
  };

  return (
    <AuthTemplate
      title="Create Your Account"
      ctaButtonText="Create my account"
      onClickCTAButton={ctaButtonHandler}
      redirectText={(textStyle, linkStyle) => (
        <p className={textStyle}>
          Already have an account?{" "}
          <Link className={linkStyle} to={"/auth/login"}>
            Login
          </Link>
        </p>
      )}
    >
      <div className="flex gap-4">
        <CustomInput
          label="First name"
          required
          placeholder="Ex: John"
          value={details.firstname}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, firstname: e.target.value }))
          }
          autoComplete="given-name"
        />
        <CustomInput
          label="Last name"
          required
          placeholder="Ex: Doe"
          value={details.lastname}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, lastname: e.target.value }))
          }
          autoComplete="family-name"
        />
      </div>
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
        label="New Password"
        required
        placeholder="Min. 8 characters"
        value={details.password}
        type={showPassword ? "text" : "password"}
        onChange={(e) =>
          setDetails((prev) => ({ ...prev, password: e.target.value }))
        }
      />
      <CustomInput
        label="Confirm Password"
        required
        placeholder="Min. 8 characters"
        value={confirmPassword}
        type={showPassword ? "text" : "password"}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
      <p>
        By creating an account, you agree to our{" "}
        <Link className="text-blue-600" to="#">
          Terms and Conditions
        </Link>
        . You may receive SMS notifications from us and can opt out at any time.
      </p>
    </AuthTemplate>
  );
};

export default Register;
