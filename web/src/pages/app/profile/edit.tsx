import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/slices/authSlice';
import { useUpdateProfileMutation } from '../../../store/api/userApi';
import { toast } from 'react-toastify';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { IoImageOutline } from 'react-icons/io5';

interface FormData {
  name: string;
  email: string;
}

interface UpdateData extends FormData {
  avatar?: File;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: UpdateData = { ...formData };
      if (avatar) {
        updateData.avatar = avatar;
      }
      await updateProfile(updateData).unwrap();
      toast.success('Profile updated successfully');
      navigate('/app/profile');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-8 mt-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/profile')}
            className="text-gray-600 hover:text-primary transition-colors"
            title="Go back to profile"
          >
            <MdOutlineKeyboardArrowLeft className="text-2xl" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-lg font-medium text-gray-800 mb-6">Profile Picture</h3>
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <img
                    src={previewUrl || "https://via.placeholder.com/200"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer">
                  <input
                    title="Upload a new profile picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <IoImageOutline size={16} />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-2">
                  Upload a new profile picture. Recommended size: 200x200px
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <IoImageOutline />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-lg font-medium text-gray-800 mb-6">Personal Information</h3>
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full h-12 px-4 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/app/profile')}
              className="px-6 py-3 rounded-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile; 