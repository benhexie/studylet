import React from "react";
import { Link } from "react-router-dom";
import "./HomeNav.css";
import Logo from "./Logo";

const HomeNav = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="p-8 flex gap-4 items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-50">
      <Logo />
      <ul className="flex items-center gap-4">
        <li className="nav__link__container">
          <button
            onClick={() => scrollToSection('home')}
            className="nav__link hover:text-primary"
          >
            Home
          </button>
        </li>
        <li className="nav__link__container">
          <button
            onClick={() => scrollToSection('features')}
            className="nav__link hover:text-primary"
          >
            Features
          </button>
        </li>
        <li className="nav__link__container">
          <button
            onClick={() => scrollToSection('benefits')}
            className="nav__link hover:text-primary"
          >
            Benefits
          </button>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <Link
          to={"/auth/login"}
          className="px-6 py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
        >
          Sign in
        </Link>
        <Link
          to={"/auth/register"}
          className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
        >
          Create free account
        </Link>
      </div>
    </div>
  );
};

export default HomeNav;
