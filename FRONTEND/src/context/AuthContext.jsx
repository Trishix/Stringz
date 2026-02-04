import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser({ ...userData, token }); // Ensure user has token for easy access if needed
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Token verification failed:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const data = await authService.login({ email, password });
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const signup = async (name, email, password) => {
        const data = await authService.signup({ name, email, password });
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const googleLogin = async (token) => {
        const data = await authService.googleLogin(token);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            signup,
            googleLogin,
            logout,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};
