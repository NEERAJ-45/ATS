import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext"; // Update this path as per your project

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setLoggedInUser, setRole } = useAuthContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form Data Submitted:", formData); // Debug: Log form data

    try {
      // Hardcoded URL for testing
      const response = await axios.post(
        "http://localhost:3000/auth/applicant/login",
        formData,
        { withCredentials: true } // Ensure cookies are included in the request
      );

      console.log("Login Response:", response.data); // Debug: Log the response

      const { user, role } = response.data.data;

      setLoggedInUser(user);
      setRole(role);

      toast.success("Login successful!");

      console.log("User role:", role); // Debug: Log the role to verify

      // Redirect based on role
      if (role === "admin") {
        console.log("Redirecting to /admin");
        navigate("/admin");
      } else if (role === "applicant") {
        console.log("Redirecting to /job-openings");
        navigate("/job-openings");
      } else {
        toast.warn("Unknown role. Please contact support.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // More robust error handling
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);

      // Log the full error for debugging if necessary
      if (error.response) {
        console.log("Error response:", error.response); // Debug: Log the error response
      } else {
        console.log("Error without response:", error); // Debug: Log the error without response
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <Toaster />
      <div className="fixed top-4 right-4 z-50">
      <Link
        to="/admin-login"
        className="bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors"
      >
        Admin Login
      </Link>
    </div>
      
      
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">Sign In</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-gray-300 text-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your email"
              required
              autoFocus // Autofocus added for better UX
            />
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2 relative">
            <label htmlFor="password" className="text-gray-300 text-sm">
              Password
            </label>
            <input
              id="password"
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
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 mt-[4px]" />
              ) : (
                <FaEye className="h-5 w-5 mt-[4px]" />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-300 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="underline">
              Register
            </Link>
          </p>

          
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
