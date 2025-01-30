import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/authSlice";
import {
  MdDashboard,
  MdAssignment,
  MdPerson,
  MdInsights,
  MdMenu,
  MdClose,
} from "react-icons/md";

const AppSlider = () => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      icon: <MdDashboard className="text-xl" />,
      href: "/app/dashboard",
    },
    {
      label: "Assessments",
      icon: <MdAssignment className="text-xl" />,
      href: "/app/assessments",
    },
    {
      label: "Statistics",
      icon: <MdInsights className="text-xl" />,
      href: "/app/stats",
    },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-primary"
      >
        {isOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary">Studylet</h1>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section - Pushed to bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200">
          <Link 
            to="/app/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
              <img
                src={user?.avatar || "https://via.placeholder.com/200"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AppSlider;
