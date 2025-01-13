import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./HomeNav.css";
import Logo from "./Logo";

const HomeNav = () => {
  const location = useLocation();

  return (
    <div className="p-8 flex gap-4 items-center justify-between">
      <Logo />
      <ul className="flex items-center gap-4">
        <li className="nav__link__container">
          <NavLink
            to={"#"}
            end
            className={() => {
              let classstr = "nav__link";
              if (location.hash === "") classstr += " active";
              return classstr;
            }}
          >
            Home
          </NavLink>
        </li>
        <li className="nav__link__container">
          <NavLink
            to={"#features"}
            end
            className={() => {
              let classstr = "nav__link";
              if (location.hash === "#features") classstr += " active";
              return classstr;
            }}
          >
            Features
          </NavLink>
        </li>
        <li className="nav__link__container">
          <NavLink
            to={"#benefits"}
            end
            className={() => {
              let classstr = "nav__link";
              if (location.hash === "#benefits") classstr += " active";
              return classstr;
            }}
          >
            Benefits
          </NavLink>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <Link
          to={"/auth/login"}
          className="p-4 pt-2 pb-2 border border-primary hover:bg-gray-500 hover:border-0 hover:text-white transition-colors"
        >
          Sign in
        </Link>
        <Link
          to={"/auth/register"}
          className="p-4 pt-2 pb-2 border bg-primary text-white hover:bg-gray-500 transition-colors"
        >
          Create free account
        </Link>
      </div>
    </div>
  );
};

export default HomeNav;
