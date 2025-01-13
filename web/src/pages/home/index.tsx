import React from "react";
import HomeNav from "../../components/HomeNav";
import Title from "./sections/title";
import Features from "./sections/features";
import Benefits from "./sections/benefits";
import HomeFooter from "../../components/HomeFooter";

const Home = () => {
  return (
    <div className="flex justify-center px-8">
      <div className="flex flex-col w-full max-w-5xl">
        <HomeNav />
        <Title />
        <Features />
        <Benefits />
        <HomeFooter />
      </div>
    </div>
  );
};

export default Home;
