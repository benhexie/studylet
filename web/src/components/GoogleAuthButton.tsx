import React from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleAuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const GoogleAuthButton = ({ onClick, isLoading }: GoogleAuthButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full p-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
      type="button"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleAuthButton;
