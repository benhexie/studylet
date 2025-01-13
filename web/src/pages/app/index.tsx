import React from "react";
import AppNav from "../../components/AppNav";
import AppSlider from "../../components/AppSlider";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="flex min-h-screen">
      <AppSlider />
      <div className="flex flex-col flex-1 bg-gray-50">
        <AppNav />
        <div className="flex-1 p-8 pb-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
