import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Registering with data:", formData);

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/applicant/register",
        formData,
        { withCredentials: true }
      );

      console.log("Registration successful:", response.data);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <Toaster />
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="fullName" className="text-gray-300 text-sm">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-gray-300 text-sm">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2 relative">
            <label htmlFor="password" className="text-gray-300 text-sm">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white pr-12"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5 mt-[4px]" /> : <FaEye className="h-5 w-5 mt-[4px]" />}
            </button>
          </div>

          {/* Gender */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="gender" className="text-gray-300 text-sm">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Age */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="age" className="text-gray-300 text-sm">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              value={formData.age}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your age"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="phone" className="text-gray-300 text-sm">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-300 transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account? <a href="/login" className="underline">Login</a>
          </p>
        </form>

      </div>
    </div>
  );
};

export default RegisterForm;
