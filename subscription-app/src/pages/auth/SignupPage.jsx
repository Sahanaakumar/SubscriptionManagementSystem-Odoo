import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import api from '../../api/client';


const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('customer');
    const { setAuthData } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Removed useEffect redirect in favor of imperative navigation after success

    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const emailCheckTimeoutRef = useRef(null);

    // Debounced Email Check
    const handleEmailChange = (val) => {
        if (!val) {
            setEmailError('');
            return;
        }

        if (emailCheckTimeoutRef.current) clearTimeout(emailCheckTimeoutRef.current);

        emailCheckTimeoutRef.current = setTimeout(async () => {
            setIsCheckingEmail(true);
            try {
                await api.post('/auth/check-email', { email: val });
                setEmailError('');
            } catch (err) {
                if (err.response && err.response.status === 409) {
                    setEmailError('Email already exists. Please enter a different email.');
                }
            } finally {
                setIsCheckingEmail(false);
            }
        }, 500);
    };

    const validatePassword = (pwd) => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        return strongRegex.test(pwd);
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        if (val && !validatePassword(val)) {
            setPasswordError('Password must be at least 8 chars, include uppercase, lowercase, number & special char.');
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            toast.error('Please fix password errors.');
            return;
        }
        if (emailError) {
            toast.error('Please resolve email errors.');
            return;
        }

        setLoading(true);
        try {
            console.log('Calling signup API...');
            const response = await api.post('/auth/signup', { name, email, password, role });
            console.log('Signup API response:', response.data);

            const { token, user } = response.data;

            if (token && user) {
                toast.success('Account created successfully!');

                // Manually set auth data without calling login endpoint again
                setAuthData(user, token);

                // Role-based navigation
                const userRole = user.role?.toLowerCase();
                let targetPath = '/dashboard';

                if (userRole === 'admin') targetPath = '/admin/dashboard';
                else if (userRole === 'internal') targetPath = '/internal/dashboard';

                console.log(`Redirecting to ${targetPath} for role ${userRole}`);
                navigate(targetPath);
            } else {
                // Fallback if response structure is unexpected
                console.error('Unexpected response structure:', response.data);
                toast.error('Account created, but failed to log in automatically. Please sign in.');
                navigate('/login');
            }

        } catch (error) {
            console.error('Signup failed:', error);
            const message = error.response?.data?.message || error.message || 'Signup failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-6">
                <h2 className="mt-6 text-3xl font-extrabold text-black">Create your account</h2>
                <p className="mt-2 text-sm text-gray-700">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-gray-600 hover:text-gray-600-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black">
                        Full Name
                    </label>
                    <div className="mt-1">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleEmailChange(e.target.value);
                            }}
                            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${emailError ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300'
                                }`}
                        />
                    </div>
                    {emailError && (
                        <p className="mt-2 text-xs text-blue-600">
                            {emailError}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-black">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${passwordError ? 'border-blue-300' : 'border-gray-300'
                                }`}
                        />
                    </div>
                    {passwordError && (
                        <p className="mt-2 text-xs text-blue-600">
                            {passwordError}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-black">
                        Sign up as
                    </label>
                    <div className="mt-1">
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading || !!passwordError || !!emailError || isCheckingEmail}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default SignupPage;
