import React from "react";
import { Link } from "react-router-dom";
const HeroImage = require("../../../assets/images/hero-image.png");

const Title = () => {
  return (
    <div className="h-screen grid sm:grid-cols-2 gap-8 grid-cols-1">
      <img
        src={HeroImage}
        alt="hero image"
        className="w-full object-contain align-middle"
      />
      <div className="flex flex-col gap-4 mt-16">
        <div>
          <span className="text-xl md:text-2l sm:text-3xl font-semibold">
            Introducing
          </span>{" "}
          <br />
          <h1 className="text-3xl md:text-5l sm:text-7xl font-bold text-primary">
            Studylet!
          </h1>
        </div>
        <span>
          Are you ready to elevate your academic journey to new heights? Look no
          further. Designed specifically for students seeking to unlock their
          full potential and ace their university examinations. Distinction is
          your key to success!
        </span>
        <Link
          to={"/auth/register"}
          className="bg-primary text-white p-4 w-fit mt-4"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Title;
