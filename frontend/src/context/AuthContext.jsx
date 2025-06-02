import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext); // ✅ CORRECT

const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [role, setRole] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const authUrl = import.meta.env.VITE_API_URL + "/auth/user";
            const response = await axios.get(authUrl, {
                withCredentials: true,
            });
            console.log("Response data: ", response.data.data);
            const currUser = response.data.data.user;
            const currRole = response.data.data.role;
            setLoggedInUser(currUser);
            setRole(currRole); 
            setIsLoggedIn(true);
        } catch (error) {
            console.log("Auth check failed:", error.message);
            setLoggedInUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    const login = (user, userRole) => {
        setLoggedInUser(user);
        setRole(userRole);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        try {
            const logoutUrl = import.meta.env.VITE_API_URL + "/auth/logout";
            const response = await axios.post(
                logoutUrl,
                {},
                { withCredentials: true },
            );

            console.log("logout response : ", response.data.data);
            setLoggedInUser(null);
            setIsLoggedIn(false);
            setRole("");
            window.location.href = "/";
        } catch (err) {
            console.log("error logging out : ", error);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                loggedInUser,
                role,
                isLoggedIn,
                login,
                logout,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
