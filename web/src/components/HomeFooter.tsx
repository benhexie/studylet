import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const HomeFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Studylet</h2>
            <p className="text-gray-400">Empowering your learning journey.</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/about" className="hover:text-gray-300">About Us</Link>
            <Link to="/features" className="hover:text-gray-300">Features</Link>
            <Link to="/contact" className="hover:text-gray-300">Contact</Link>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaInstagram size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaLinkedin size={24} />
          </a>
        </div>
        <div className="text-center text-gray-400">
          &copy; {new Date().getFullYear()} Studylet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;