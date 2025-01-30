import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSlider from '../components/AppSlider';

const AppLayout = () => {
  const location = useLocation();
  const fullWidthPaths = [
    '/app/assessment/upload',
    '/app/assessment/start',
    '/app/assessment/practice',
    '/app/assessment/.+/results',
  ];

  const isFullWidth = fullWidthPaths.some(path => new RegExp(path).test(location.pathname));

  if (isFullWidth) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <AppSlider />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout; 