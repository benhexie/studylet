import React from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import "./AppSlider.css";
import { GoHome } from "react-icons/go";
import { IoMdPaper } from "react-icons/io";
import { FiUpload } from "react-icons/fi";

const AppSlider = () => {
  return (
    <div className="w-60 bg-white border-r border-gray-400">
      <div className="sticky top-0  p-4 pt-8">
        <Logo to="/app/dashboard" />
        <div className="mt-8 flex flex-col">
          <NavLink to={"/app/dashboard"} className={"app__slider__item"}>
            <GoHome />
            <span className="">Dashboard</span>
          </NavLink>
          <NavLink to={"/app/assessments"} className={"app__slider__item"}>
            <IoMdPaper />
            <span className="">Assessments</span>
          </NavLink>
          <Link to={"/assessment/upload"} className="px-4 py-2 rounded-md bg-primary text-white mt-8 flex items-center gap-2">
            <span className="">Upload document</span>
            <FiUpload />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppSlider;
