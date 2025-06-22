// frontend/src/Pages/ProfilePage.jsx
import React, { useState } from "react";
import { FaCamera, FaUser, FaMapMarkerAlt, FaBriefcase, FaSignature } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { useAuthStore } from "../store/useAuthStore.js";
import defaultProfilePic from "../assets/DamoProfilePic.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    username: authUser?.username || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    occupation: authUser?.occupation || "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(authUser?.avatar?.url || defaultProfilePic);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024){
        toast.error("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      data.append(key, value);
    }
  });
  if (avatarFile) {
    data.append("avatar", avatarFile);
  }

  // Debug FormData contents
  console.log("FormData contents:");
  for (let [key, value] of data.entries()) {
    console.log(`${key}:`, value instanceof File ? value.name : value);
  }

  try {
    const success = await updateProfile(data);
    if (success) {
      console.log("Profile update successful, navigating to /chats");
      navigate("/chats");
    }
  } catch (error) {
    console.error("Profile update error:", error.response?.data || error.message);
    toast.error(error?.response?.data?.message || "Failed to update profile");
  }
};

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white px-6 py-12">
      
      {/* Left Logo Section */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 p-6">
        <img
          src="https://res.cloudinary.com/ddcg0rzlo/image/upload/v1651418249/new-nft_tlfisy.png"
          alt="Logo"
          className="w-28 h-28 lg:w-32 lg:h-32 rounded-full border-4 border-pink-500 shadow-xl mb-4 hover:scale-110 transition-transform"
        />
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 drop-shadow-md">
          KozyChat
        </h1>
        <p className="text-gray-300 mt-4 max-w-md text-base">
          Customize your KozyChat profile. Upload an avatar, edit your details, and show off your personality.
        </p>
      </div>

      {/* Profile Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full lg:w-1/2 bg-gray-900/60 p-8 rounded-xl shadow-xl backdrop-blur-md space-y-6 border border-fuchsia-600 animate-fade-in"
        encType="multipart/form-data"
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative group">
            <img
              src={previewImage || defaultProfilePic}
              alt="Avatar"
              className="w-32 h-32 rounded-3xl border-4 border-fuchsia-500 object-cover group-hover:opacity-90 transition"
            />
            <label
              htmlFor="avatar"
              className="absolute bottom-0 right-0 bg-fuchsia-600 p-2 rounded-2xl cursor-pointer hover:bg-fuchsia-700 transition"
              title="Change Avatar"
            >
              <FaCamera className="text-white" />
              <input type="file" id="avatar" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          <span className="flex items-center text-sm text-gray-400 gap-1 mt-2">
            <MdMarkEmailRead /> {authUser?.email || "email"}
          </span>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaUser className="absolute top-4 left-3 text-purple-400" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
          <div className="relative">
            <FaSignature className="absolute top-4 left-3 text-purple-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
          <div className="relative">
            <FaMapMarkerAlt className="absolute top-4 left-3 text-purple-400" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
          <div className="relative">
            <FaBriefcase className="absolute top-4 left-3 text-purple-400" />
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="w-full pl-10 p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>
        </div>

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="Your Bio (max 200 characters)"
          maxLength={200}
          value={formData.bio}
          onChange={handleInputChange}
          className="w-full p-3 h-28 bg-gray-800 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-500 placeholder:text-gray-400"
        />

        {/* Submit Button */}
        {/* Submit */}
        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="w-full py-3 rounded-md bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 cursor-pointer transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdatingProfile ? "Updating..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;