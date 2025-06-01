import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios"
const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext); // ✅ CORRECT

const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [role, setRole] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const authUrl = import.meta.env.VITE_API_URL + "/auth/user";
            const response = await axios.get(authUrl, {
                withCredentials: true
            })
            console.log('Response data: ', response.data.data);
            const currUser = response.data.data.user;
            const currRole = response.data.data.role;
            setLoggedInUser(currUser);
            setRole(currRole); // Assuming your backend returns role
            setIsLoggedIn(true);
        } catch (error) {
            console.log("Auth check failed:", error.message);
            setLoggedInUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider
            value={{ loggedInUser, role, isLoggedIn, setLoggedInUser, setRole, setIsLoggedIn }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
