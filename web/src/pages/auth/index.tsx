import React from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../../components/Logo";
import { FaArrowLeft } from "react-icons/fa6";

const Auth = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="relative flex flex-col w-full max-w-xl items-center gap-4">
        <Link
          to="/"
          className="absolute top-0 left-0 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <Logo className="mb-8 mt-16" />
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
