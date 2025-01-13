import React from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../../components/Logo";
import { IoHome } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";

const Auth = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="relative flex flex-col w-full max-w-xl items-center gap-4">
        <Link
          to="/"
          className="absolute top-0 left-0 hover:text-primary transition-colors"
        >
          <IoHome className="text-2xl" />
          <div className="flex items-center gap-1">
            <FaArrowLeft />
            <p>Home</p>
          </div>
        </Link>
        <Logo className="mb-4" />
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
