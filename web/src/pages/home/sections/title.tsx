import React from "react";
import { Link } from "react-router-dom";

const Title = () => {
  return (
    <div id="home" className="min-h-screen grid sm:grid-cols-2 gap-8 grid-cols-1 items-center">
      <div className="flex flex-col gap-6 order-2 sm:order-1">
        <div className="space-y-4">
          <span className="text-xl md:text-2xl bg-blue-50 text-primary px-4 py-2 rounded-full">
            Introducing
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            Study<span className="text-primary">let!</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Are you ready to elevate your academic journey to new heights? Look no
            further. Designed specifically for students seeking to unlock their
            full potential and ace their university examinations.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to={"/auth/register"}
            className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-all transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <a 
            href="#features" 
            className="px-8 py-4 rounded-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all transform hover:-translate-y-1"
          >
            Learn More
          </a>
        </div>
      </div>
      <div className="order-1 sm:order-2">
        <img
          src="https://placehold.co/600x400/e6e6e6/1a1a1a?text=Study+Smart"
          alt="hero image"
          className="w-full object-contain align-middle hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default Title;
