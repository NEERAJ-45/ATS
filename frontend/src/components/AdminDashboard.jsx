import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDownload, FaCheck, FaTimes, FaSpinner, FaEye } from "react-icons/fa";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavBar from "./Navbar";
const AdminDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [showConfirm, setShowConfirm] = useState(true);
    const [pendingAction, setPendingAction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const { isLoggedIn, role } = useAuthContext();
    useEffect(() => {
        if (!isLoggedIn || role !== "admin") {
            navigate("/");
        }
    }, [isLoggedIn, role]);

    // Fetch data from API using Axios
    useEffect(() => {
        const fetchApplicants = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    "http://localhost:3000/application/applications",
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );

                if (response.data.success) {
                    const applicationsData = response.data.data.map(
                        (application) => ({
                            id: application._id,
                            name: application.applicant.fullName,
                            phone: application.applicant.phone,
                            email: application.applicant.email,
                            resume: application.resumePath,
                            atsScore: application.resumeScore,
                            status: application.status,
                            appliedAt: application.appliedAt,
                        }),
                    );
                    setApplications(applicationsData);
                }
            } catch (error) {
                console.error("Error fetching applicants:", error);
                if (error.response) {
                    if (error.response.status === 403) {
                        setError(
                            "Admin access required. Please login with admin credentials.",
                        );
                    } else {
                        setError(
                            error.response.data?.message ||
                                "Server error occurred",
                        );
                    }
                } else if (error.request) {
                    setError("No response received from server");
                } else {
                    setError("Request setup error");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplicants();
    }, []);

    const approveApplication = async (id) => {
        setIsProcessing(true);
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:3000/application/accept",
                { id },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token",
                        )}`,
                    },
                },
            );

            if (response.data.success) {
                setApplications((prev) =>
                    prev.map((app) =>
                        app.id === id ? { ...app, status: "selected" } : app,
                    ),
                );
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Handle unauthorized
            }
            setError(
                error.response?.data?.message || "Failed to accept application",
            );
        } finally {
            setIsProcessing(false);
            setPendingAction(null);
        }
    };

    const rejectApplication = async (id) => {
        setIsProcessing(true);
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:3000/application/reject",
                { id: id },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.data.success) {
                setApplications((prev) =>
                    prev.map((app) =>
                        app.id === id ? { ...app, status: "rejected" } : app,
                    ),
                );
            } else {
                throw new Error(response.data.message || "Rejection failed");
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to reject application",
            );
        } finally {
            setIsProcessing(false);
            setPendingAction(null);
        }
    };

    const handlePreview = async (id) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/application/download/${id}`,
            {
                responseType: "blob", // Fetch the file as a blob
                withCredentials: true,
            },
        );

        const fileBlob = new Blob([response.data], {
            type: response.headers["content-type"],
        });
        const fileURL = URL.createObjectURL(fileBlob);
        window.open(fileURL, "_blank"); // Open the blob URL in a new tab
    };
    const triggerAction = (id, actionType) => {
        if (showConfirm) {
            setPendingAction({ id, actionType });
        } else {
            executeAction(id, actionType);
        }
    };

    const executeAction = (id, actionType) => {
        if (actionType === "approve") {
            approveApplication(id);
        } else if (actionType === "reject") {
            rejectApplication(id);
        }
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-950 text-white p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-semibold mb-8 text-center">
                        Admin Dashboard
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <FaSpinner className="animate-spin text-2xl text-blue-400" />
                        </div>
                    ) : error ? (
                        <div className="mb-4 p-4 bg-red-900/50 rounded-lg">
                            <p className="text-center text-red-400">{error}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-900 border border-gray-800">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Phone
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Resume
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            ATS Score
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Applied On
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-200 text-sm divide-y divide-gray-800">
                                    {applications.map((application) => (
                                        <tr
                                            key={application.id}
                                            className="hover:bg-gray-800 transition duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {application.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {application.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {application.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        handlePreview(
                                                            application.id,
                                                        );
                                                    }}
                                                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                >
                                                    <FaEye />
                                                    <span className="underline">
                                                        Preview
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {application.atsScore.toFixed(
                                                    2,
                                                )}
                                                %
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(
                                                    application.appliedAt,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {application.status ===
                                                "selected" ? (
                                                    <span className="text-green-400 font-semibold">
                                                        Approved
                                                    </span>
                                                ) : application.status ===
                                                  "rejected" ? (
                                                    <span className="text-red-400 font-semibold">
                                                        Rejected
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() =>
                                                                triggerAction(
                                                                    application.id,
                                                                    "approve",
                                                                )
                                                            }
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                        >
                                                            {isProcessing &&
                                                            pendingAction?.id ===
                                                                application.id &&
                                                            pendingAction?.actionType ===
                                                                "approve" ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaCheck />
                                                            )}
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                triggerAction(
                                                                    application.id,
                                                                    "reject",
                                                                )
                                                            }
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50"
                                                            disabled={
                                                                isProcessing
                                                            }
                                                        >
                                                            {isProcessing &&
                                                            pendingAction?.id ===
                                                                application.id &&
                                                            pendingAction?.actionType ===
                                                                "reject" ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaTimes />
                                                            )}
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {pendingAction && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                                <h2 className="text-lg font-semibold mb-4">
                                    Confirm{" "}
                                    {pendingAction.actionType === "approve"
                                        ? "Approval"
                                        : "Rejection"}
                                    ?
                                </h2>
                                <p className="mb-4 text-gray-300">
                                    Are you sure you want to{" "}
                                    {pendingAction.actionType} this application?
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="flex items-center text-sm text-gray-400">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={!showConfirm}
                                            onChange={(e) =>
                                                setShowConfirm(
                                                    !e.target.checked,
                                                )
                                            }
                                        />
                                        Don't show again
                                    </label>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setPendingAction(null)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            executeAction(
                                                pendingAction.id,
                                                pendingAction.actionType,
                                            )
                                        }
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Confirm"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
