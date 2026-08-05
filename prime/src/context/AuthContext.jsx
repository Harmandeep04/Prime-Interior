import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [token, setToken]     = useState(() => localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Axios default header set karo
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // App open hone pe token se user info laao
    useEffect(() => {
        const fetchMe = async () => {
            if (!token) { setLoading(false); return; }
            try {
                const res = await axios.get(`${BASE_URL}/api/auth/me`);
                if (res.data.success) setUser(res.data.user);
            } catch {
                // Token expired ho gaya — logout
                localStorage.removeItem('token');
                setToken(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, [token]);

    const login = useCallback(async (email, password) => {
        const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
        }
        return res.data;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const res = await axios.post(`${BASE_URL}/api/auth/register`, { name, email, password });
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
        }
        return res.data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook — components mein easily use karo
export const useAuth = () => useContext(AuthContext);