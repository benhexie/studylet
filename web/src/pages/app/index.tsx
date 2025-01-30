import React from "react";
import { Outlet } from "react-router-dom";
import AppSlider from "../../components/AppSlider";
import DashboardNav from "../../components/DashboardNav";
import { SearchProvider } from "../../contexts/SearchContext";

const MainApp = () => {
  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AppSlider />
        <div className="flex-1">
          <DashboardNav />
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

export default MainApp;
