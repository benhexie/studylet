import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./HomeNav.css";
import Logo from "./Logo";
import { MdMenu, MdClose } from 'react-icons/md';

const HomeNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 flex gap-4 items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between w-full">
        <Logo />
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <MdClose /> : <MdMenu />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-8">
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden p-4">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="w-full text-left py-2 hover:text-primary"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full text-left py-2 hover:text-primary"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('benefits')}
                  className="w-full text-left py-2 hover:text-primary"
                >
                  Benefits
                </button>
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              <Link
                to={"/auth/login"}
                className="block w-full px-6 py-2 text-center rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                Sign in
              </Link>
              <Link
                to={"/auth/register"}
                className="block w-full px-6 py-2 text-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
              >
                Create free account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeNav;
