import React, { useState } from "react";
import { toast } from "react-toastify";

const ApplicantForm = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !phone || !resume || !skills) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError("");

    // Simulate successful form submission
    toast.success("Application submitted successfully!");

    // Optionally reset form
    setName("");
    setEmail("");
    setPhone("");
    setResume(null);
    setSkills("");

    // Close the modal after successful submission
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-md space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-white text-center">Apply Now</h2>

        {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-gray-300 text-sm">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-gray-300 text-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="phone" className="text-gray-300 text-sm">
              Mobile Number
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          {/* Resume Upload */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="resume" className="text-gray-300 text-sm">
              Upload Resume
            </label>
            <input
              id="resume"
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {/* Skills Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="skills" className="text-gray-300 text-sm">
              Skills (e.g., React, Node.js)
            </label>
            <input
              id="skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your skills"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-300 transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicantForm;
