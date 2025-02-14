import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex flex-col items-center ${className}`}>
      <h1 className="text-3xl font-bold text-primary tracking-wider">
        STUDYLET
      </h1>
      <p className="text-sm text-gray-500 mt-1">Learn Smarter</p>
    </Link>
  );
};

export default Logo;
