import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
import { toast, Toaster } from "react-hot-toast";

// Note: We're using the lucide-react library for icons instead of react-icons
// This library is available in the environment
import { User, Mail, Phone, Lock, LogOut } from "lucide-react";

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = async (e) => {
    // Placeholder logout function
    // Uncomment and modify as per your authentication logic
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Toaster />
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="bg-gray-800 shadow-lg rounded-t-2xl p-6 mb-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="bg-blue-700 rounded-full p-6 flex items-center justify-center">
                    <User size={48} className="text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">User Profile</h2>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-gray-800 shadow-lg mb-6 p-2">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 mx-1 rounded-lg font-medium ${activeTab === "profile" ? "bg-blue-700 text-blue-100" : "text-gray-400 hover:bg-gray-700"}`}
              >
                Profile Information
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-gray-800 shadow-lg rounded-b-2xl p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-200 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="bg-blue-800 p-3 rounded-xl mr-4">
                    <Mail className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Email Address</h3>
                    <p className="text-gray-100 font-medium">example@domain.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="bg-blue-800 p-3 rounded-xl mr-4">
                    <Phone className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Phone Number</h3>
                    <p className="text-gray-100 font-medium">+91 123 456 7890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
