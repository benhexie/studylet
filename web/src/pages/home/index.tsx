import React from "react";
import HomeNav from "../../components/HomeNav";
import Title from "./sections/title";
import Features from "./sections/features";
import Benefits from "./sections/benefits";
import HomeFooter from "../../components/HomeFooter";

const Home = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <HomeNav />
        <div className="space-y-20 px-8">
          <Title />
          <Features />
          <Benefits />
        </div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default Home;
