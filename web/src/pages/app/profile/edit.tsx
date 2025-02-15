import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectAuth,
  setCredentials,
} from "../../../store/slices/authSlice";
import { useUpdateProfileMutation } from "../../../store/api/userApi";
import { toast } from "react-toastify";
import { MdArrowBack } from "react-icons/md";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { token } = useSelector(selectAuth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const updatedUser = await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      }).unwrap();

      // Update the user in Redux state
      dispatch(
        setCredentials({
          user: updatedUser,
          token: token || "",
        })
      );

      toast.success("Profile updated successfully");
      navigate("/app/profile");
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-8 mt-10">
        <div className="flex items-center gap-4">
          <button
            title="Back"
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <MdArrowBack className="text-2xl" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-8"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={true}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
