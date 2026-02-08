import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100">
                    <ShieldAlert className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Access Denied
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        You do not have permission to access this page.
                    </p>
                </div>
                <div className="mt-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Go back to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 text-sm font-medium text-blue-600 hover:text-gray-600-500"
                    >
                        Sign in with a different account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
