// frontend/src/Pages/LoginPage.jsx
// import React from "react";

import React, { useState } from 'react';

import FloatingShape from '../components/FloatingShape.jsx';

import { FaEnvelope } from "react-icons/fa";
import { BsWechat } from "react-icons/bs";
import { PiEyeBold, PiEyeClosedBold, PiSpinnerBold } from "react-icons/pi";


import { Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const { login, isLogin } = useAuthStore();

    const handleSubmit = async (e) => {
      e.preventDefault();
      login(formData);
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Floating Shapes */}
      <FloatingShape color="bg-purple-500" size="w-80 h-80" top="-10%" left="10%" delay={1} />
      <FloatingShape color="bg-cyan-400" size="w-56 h-56" top="60%" left="85%" delay={3} />
      <FloatingShape color="bg-pink-400" size="w-64 h-64" top="20%" left="70%" delay={4} />
      <FloatingShape color="bg-indigo-500" size="w-48 h-48" top="75%" left="-5%" delay={2} />

      <div className="flex h-screen items-center justify-center p-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-white">
          
          {/* Image on the Left */}
          <div className="w-full md:w-1/2 hidden md:block">
            <img
              src="https://plus.unsplash.com/premium_photo-1684761875683-b66e09ad44c2?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                Welcome Back
              </h2>
              <p className="text-gray-500 text-center text-sm mt-2">
                Sign in to your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
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
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center cursor-pointer " disabled={isLogin}>
                {isLogin ? (
                  <>
                    <PiSpinnerBold className="size-5 animate-spin inline-block mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Already have account */}
              <p className="text-center text-gray-600 mt-4">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;