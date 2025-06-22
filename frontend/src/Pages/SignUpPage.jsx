// frontend/src/Pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import FloatingShape from '../components/FloatingShape.jsx';
import { Link } from "react-router-dom";
import { FaLock, FaUser, FaEnvelope } from "react-icons/fa";
import { BsWechat } from "react-icons/bs";
import { PiEyeBold, PiEyeClosedBold, PiSpinnerBold } from "react-icons/pi";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSignUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center relative overflow-hidden">
      {/* Floating Shapes */}
      <FloatingShape color="bg-emerald-500" size="w-72 h-72" top="-10%" left="5%" delay={0} />
      <FloatingShape color="bg-violet-500" size="w-64 h-64" top="20%" left="80%" delay={2} />
      <FloatingShape color="bg-pink-500" size="w-55 h-55" top="30%" left="50%" delay={5} />
      <FloatingShape color="bg-indigo-400" size="w-48 h-48" top="75%" left="-5%" delay={4} />
      <FloatingShape color="bg-teal-500" size="w-40 h-40" top="60%" left="60%" delay={3} />

      <div className="flex h-screen items-center justify-center p-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-white">
          
          {/* Image on the Left */}
          <div className="w-full md:w-1/2 hidden md:block">
            <img
              src="https://plus.unsplash.com/premium_photo-1720448972781-91b85867c099?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
              alt="Sign Up"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Form on the Right */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            {/* Animated Icon and Heading */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="size-16 rounded-[23px] bg-gradient-to-tr from-green-400 via-blue-500 to-purple-500 shadow-xl animate-pulse relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-sm"></div>
                <BsWechat className="relative z-10 text-white text-2xl animate-bounce" />
              </div>
              <h2 className="text-4xl font-bold mt-4 text-gray-800 text-center">
                Create Your Account
              </h2>
              <p className="text-gray-500 text-center text-sm mt-2">
                Get started with your free account today
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <PiEyeBold className="size-5 text-gray-500" />
                  ) : (
                    <PiEyeClosedBold className="size-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-lg font-semibold shadow-md cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105" disabled={isSignUp}>
                {isSignUp ? (
                  <>
                    <PiSpinnerBold className="size-5 animate-spin inline-block mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Already have account */}
              <p className="text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline font-semibold">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;