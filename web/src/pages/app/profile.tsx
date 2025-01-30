import React from 'react';
import { MdEdit, MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { useLogoutMutation } from '../../store/api/authApi';
import { toast } from 'react-toastify';
import { useGetStatisticsQuery } from '../../store/api/statisticsApi';

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [logout] = useLogoutMutation();
  const { data: stats } = useGetStatisticsQuery();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/auth/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-8 mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 flex items-center gap-2 hover:border-red-500 hover:text-red-500 transition-colors"
            >
              <MdLogout />
              <span>Log Out</span>
            </button>
            <button 
              onClick={() => navigate('/app/profile/edit')}
              className="px-6 py-3 rounded-lg bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <MdEdit />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-primary overflow-hidden">
                <img
                  src={user?.avatar || "https://via.placeholder.com/200"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-lg">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-medium text-gray-800 mb-6">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Completed Assessments</p>
              <p className="text-2xl font-semibold text-primary">
                {stats?.completedAssessments || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Average Score</p>
              <p className="text-2xl font-semibold text-primary">
                {stats ? `${stats.averageScore.toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Study Hours</p>
              <p className="text-2xl font-semibold text-primary">
                {stats ? `${stats.studyHours}h` : '0h'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const statistics = [
  { label: "Completed Assessments", value: "45" },
  { label: "Average Score", value: "85%" },
  { label: "Study Hours", value: "126h" },
];

export default Profile;