import React, { createContext, useState } from 'react';
import api from '../api/client';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading] = useState(false); // No async checks needed initially with localStorage

    const login = async (email, password, role) => {
        try {
            console.log('AuthContext: login start', { email, role });
            const response = await api.post('/auth/login', { email, password });
            console.log('AuthContext: login response', response.data);
            const { token, user } = response.data;

            if (role && user.role !== role) {
                console.error('Role mismatch:', { userRole: user?.role, requestedRole: role });
                throw new Error('Selected role does not match your account.');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('AuthContext: setting user state', user);
            setUser(user);
            toast.success(`Welcome back, ${user.name} !`);
            return user;
        } catch (error) {
            console.error('Login failed:', error);
            // Don't toast here if we want the caller to handle it, or toast and rethrow
            const message = error.message || error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw error; // Rethrow so SignupPage knows it failed
        }
    };

    const setAuthData = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        // Toast can be handled by the caller or here. Choosing to let caller handle it for specific messages.
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setAuthData, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
