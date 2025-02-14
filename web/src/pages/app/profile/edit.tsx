import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/slices/authSlice";
import { useUpdateProfileMutation } from "../../../store/api/userApi";
import { toast } from "react-toastify";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
      navigate("/app/profile");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button
          title="Back"
          onClick={() => navigate(-1)}
          className="hover:text-primary transition-colors"
        >
          <MdOutlineKeyboardArrowLeft className="text-2xl" />
        </button>
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="p-4 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="p-4 rounded-lg border border-gray-300"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="p-4 rounded-lg border border-gray-300"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/70"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
