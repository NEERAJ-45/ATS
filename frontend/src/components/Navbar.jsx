import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
const Navbar = () => {
    const navigate = useNavigate();
    const { logout, role } = useAuthContext();

    const handleEditProfile = () => {
        navigate("/profile"); // Adjust based on your route
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold">DKTE Careers</h1>
            <div className="flex items-center gap-4">
                {role !== "admin" ? (
                    <button
                        onClick={handleEditProfile}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                    >
                        Profile
                    </button>
                ) : null}
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
