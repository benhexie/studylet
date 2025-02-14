import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/authSlice";
import { MdAccountCircle } from "react-icons/md";

const AppNav = () => {
  const user = useSelector(selectUser);

  return (
    <div className="h-20 border-b border-gray-400 py-4 px-8 flex items-center justify-between sticky top-0 z-50 bg-gray-50">
      <h2 className="font-medium text-primary">
        Welcome, <span className="">{user?.firstName}</span>
      </h2>
      <Link
        to={"/app/profile"}
        className="relative w-10 h-10 rounded-full border-2 border-primary overflow-hidden"
      >
        <div className="absolute border-2 border-white w-full h-full z-10 rounded-full" />
        {user?.avatar ? (
          <img
            className="w-full h-full object-cover"
            src={user.avatar}
            alt="profile"
          />
        ) : (
          <MdAccountCircle className="w-full h-full text-gray-400" />
        )}
      </Link>
    </div>
  );
};

export default AppNav;
