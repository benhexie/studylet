import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const Assessment = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="h-20 border-b border-gray-400 py-4 px-8 flex items-center bg-white sticky top-0">
        <button
          className="flex items-center gap-1 text-gray-600 hover:underline underline-offset-2 p-2 pl-0"
          onClick={() => navigate(-1)}
        >
          <MdOutlineKeyboardArrowLeft className="text-xl" />
          <span className="">Back</span>
        </button>
      </div>
      <div className="flex justify-center flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Assessment;
