import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
if (API_BASE_URL) {
    axios.defaults.baseURL = API_BASE_URL;
}

// Add request interceptor for better error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            error.message = 'Network error. Please check your connection.';
        }
        return Promise.reject(error);
    }
);

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        // Check for stored token on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password,
            });

            if (!response.data) {
                throw new Error('Invalid response from server');
            }

            const { access_token, token: authToken, user: userData } = response.data;
            const finalToken = access_token || authToken;

            if (!finalToken) {
                throw new Error('No authentication token received');
            }

            if (!userData) {
                throw new Error('No user data received');
            }

            setToken(finalToken);
            setUser(userData);

            localStorage.setItem('token', finalToken);
            localStorage.setItem('user', JSON.stringify(userData));

            axios.defaults.headers.common['Authorization'] = `Bearer ${finalToken}`;

            return userData;
        } catch (error) {
            console.error('Login error:', error);

            // Improve error handling
            if (error.response) {
                // Server responded with error status
                const message = error.response.data?.message ||
                    error.response.data?.error ||
                    `Authentication failed: ${error.response.status}`;
                const enhancedError = new Error(message);
                enhancedError.response = error.response;
                throw enhancedError;
            } else if (error.request) {
                // Request made but no response
                throw new Error('Unable to connect to server. Please check your internet connection.');
            } else {
                // Error in request setup
                throw error;
            }
        }
    };

    const refreshBalance = async () => {
        if (!user?.id) return;
        try {
            const response = await axios.get(`/api/users/${user.id}/balance`);
            if (response.data?.balance !== undefined) {
                setBalance(response.data.balance);
            }
        } catch (error) {
            console.error('Error refreshing balance:', error);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setBalance(0);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        balance,
        login,
        logout,
        refreshBalance,
        loading,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
