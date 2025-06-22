import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {
  FaShieldAlt, FaBolt, FaUsers, FaComments, FaGlobe, FaHeart, FaSmile, FaRobot, FaSyncAlt
} from 'react-icons/fa';

function LandingPage() {
  const navigate = useNavigate();

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const features = [
    { icon: <FaShieldAlt />, color: 'text-blue-400', title: 'End-to-End Encryption', desc: 'Keep your chats private.' },
    { icon: <FaBolt />, color: 'text-yellow-400', title: 'Lightning Fast', desc: 'Real-time speed without lag.' },
    { icon: <FaUsers />, color: 'text-green-400', title: 'Group Chats', desc: 'Connect with your entire team.' },
    { icon: <FaComments />, color: 'text-purple-400', title: 'Smart Suggestions', desc: 'AI-enhanced chat responses.' },
    { icon: <FaGlobe />, color: 'text-red-400', title: 'Global Connectivity', desc: 'Worldwide, no boundaries.' },
    { icon: <FaHeart />, color: 'text-pink-400', title: 'Ad-Free Forever', desc: 'Clean and distraction-free.' },
    { icon: <FaSmile />, color: 'text-orange-400', title: 'Custom Emojis', desc: 'Express uniquely!' },
    { icon: <FaRobot />, color: 'text-indigo-400', title: 'AI Chatbot', desc: 'Instant smart assistance.' },
    { icon: <FaSyncAlt />, color: 'text-cyan-400', title: 'Seamless Sync', desc: 'Messages everywhere.' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-[#0f172a] text-white overflow-hidden">
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "#0f172a" },
          particles: {
            number: { value: 80 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: 2 },
            move: { enable: true, speed: 1.5 }
          }
        }}
        className="absolute inset-0 z-0"
      />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="z-10 text-center px-4 mt-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Welcome to <span className="text-purple-400">KozyChat</span>
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-300">The Future of Fast, Secure, and Smart Messaging</p>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-10 py-16 z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-gray-200 max-w-xl space-y-6"
        >
          <p className="text-gray-300 text-lg leading-relaxed">
            KozyChat redefines communication with blazing speed, AI enhancements, and end-to-end security — your new favorite messaging app!
          </p>
          <ul className="space-y-2 text-gray-400 text-base">
            <li>🔒 End-to-End Encryption</li>
            <li>⚡ Real-Time Messaging</li>
            <li>🌍 Global Reach</li>
            <li>🤖 Smart AI Suggestions</li>
            <li>💬 Custom Emojis & Smart Sync</li>
          </ul>
          <motion.button
            onClick={() => navigate('/signup')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:from-blue-600 hover:to-purple-500 transition-all flex items-center gap-2"
          >
            Get Started Now <FaBolt className="text-yellow-300" />
          </motion.button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://res.cloudinary.com/ddcg0rzlo/image/upload/v1651418249/new-nft_tlfisy.png"
            alt="Chat Hero"
            className="w-[280px] md:w-[360px] rounded-full border-4 border-purple-500 shadow-2xl hover:rotate-6 hover:scale-105 transition duration-500"
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="w-full px-8 py-16 bg-[#1e293b] z-10 rounded-t-3xl">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-12"
        >
          Why Choose <span className="text-green-400">KozyChat?</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="bg-[#273549] p-6 rounded-xl text-center shadow-lg"
            >
              <div className={`text-5xl mb-4 ${feature.color}`}>{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
