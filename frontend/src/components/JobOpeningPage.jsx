import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext"; // Adjust path as needed
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const JobOpeningPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        resume: null,
        skills: "",
    });
    const [formError, setFormError] = useState("");

    const { isLoggedIn, role } = useAuthContext();
    useEffect(() => {
        if (!isLoggedIn || role !== "applicant") {
            navigate("/");
        }
    }, [isLoggedIn, role]);

    const openModal = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to apply.");
            return;
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, phone, resume, skills } = formData;

        if (!name || !email || !phone || !resume || !skills) {
            setFormError("Please fill in all fields.");
            return;
        }

        setFormError("");

        const data = new FormData();
        data.append("resume", resume);

        try {
            const response = await axios.post(
                "http://localhost:3000/application/apply",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                },
            );

            if (response.status === 200 || response.status === 201) {
                toast.success("Application submitted successfully!");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    resume: null,
                    skills: "",
                });
                closeModal();
            } else {
                toast.error("Failed to submit application.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-6">
                <Toaster />
                <div className="w-full max-w-6xl bg-gray-900 p-10 rounded-3xl shadow-xl mt-6 animate-fade-in transition duration-700">
                    <h1 className="text-4xl font-bold text-center mb-6">
                        SDE I - Job Opening
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8 text-gray-300 mb-4">
                        <div className="space-y-2">
                            <p>
                                <span className="font-semibold text-white">
                                    Company:
                                </span>{" "}
                                DKTE Technologies
                            </p>
                            <p>
                                <span className="font-semibold text-white">
                                    Location:
                                </span>{" "}
                                Remote / Bangalore
                            </p>
                            <p>
                                <span className="font-semibold text-white">
                                    CTC:
                                </span>{" "}
                                ₹12 - ₹15 LPA
                            </p>
                            <p>
                                <span className="font-semibold text-white">
                                    Experience:
                                </span>{" "}
                                0-2 years
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                <span className="font-semibold text-white">
                                    Skills:
                                </span>{" "}
                                React.js, Node.js, JavaScript
                            </p>
                            <p>
                                <span className="font-semibold text-white">
                                    APIs:
                                </span>{" "}
                                REST APIs, Express.js
                            </p>
                            <p>
                                <span className="font-semibold text-white">
                                    Tools:
                                </span>{" "}
                                Git, Postman, Docker
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 mt-4">
                        Join a fast-paced environment and work with cutting-edge
                        technology. We value clean code, collaboration, and
                        growth. Apply now and be part of something exciting!
                    </p>

                    <button
                        onClick={openModal}
                        className="mt-8 w-full md:w-1/2 p-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 mx-auto block"
                    >
                        Apply Now
                    </button>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                        <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-8 transform scale-95 animate-zoom-in relative">
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                                onClick={closeModal}
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold text-center text-white mb-4">
                                Apply for SDE I
                            </h2>

                            {formError && (
                                <p className="text-red-500 text-sm text-center mb-2">
                                    {formError}
                                </p>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {[
                                    {
                                        label: "Full Name",
                                        name: "name",
                                        type: "text",
                                        placeholder: "Your name",
                                    },
                                    {
                                        label: "Email Address",
                                        name: "email",
                                        type: "email",
                                        placeholder: "you@example.com",
                                    },
                                    {
                                        label: "Mobile Number",
                                        name: "phone",
                                        type: "text",
                                        placeholder: "10-digit phone number",
                                    },
                                    {
                                        label: "Skills",
                                        name: "skills",
                                        type: "text",
                                        placeholder: "React, Node.js, etc.",
                                    },
                                ].map(({ label, name, type, placeholder }) => (
                                    <div key={name}>
                                        <label className="text-sm text-gray-300">
                                            {label}
                                        </label>
                                        <input
                                            type={type}
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            placeholder={placeholder}
                                            className="mt-1 w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="text-sm text-gray-300">
                                        Upload Resume
                                    </label>
                                    <input
                                        type="file"
                                        name="resume"
                                        onChange={handleChange}
                                        className="mt-1 w-full text-sm text-gray-300 bg-gray-800 p-2 rounded-lg border border-gray-700"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full p-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-300 transition-all"
                                >
                                    Submit Application
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default JobOpeningPage;
