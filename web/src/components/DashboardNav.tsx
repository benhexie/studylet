import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import { useSearch } from '../contexts/SearchContext';

const DashboardNav = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Only navigate to assessments page if we're not already there
    if (!location.pathname.includes('/app/assessments') && query) {
      navigate('/app/assessments');
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search assessments..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white transition-colors outline-none"
          />
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
      </div>

      {/* Time Period Filter */}
      <div className="flex items-center">
        <select
          name='time-period'
          title='Select a time period'
        className="h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 focus:border-primary outline-none cursor-pointer hover:border-gray-300 transition-colors">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>
  );
};

export default DashboardNav; 