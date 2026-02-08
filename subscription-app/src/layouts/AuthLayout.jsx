import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Branding & Intro */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary to-secondary-900 opacity-90"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

                <div className="relative z-10 text-white">
                    <h1 className="text-5xl font-bold mb-6">Subscription<br />Manager</h1>
                    <p className="text-xl text-gray-600-100 max-w-md">
                        Streamline your recurring billing, manage customers, and grow your subscription business with ease.
                    </p>
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className="text-gray-600-100">Automated Invoicing</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className="text-gray-600-100">Smart Analytics</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className="text-gray-600-100">Secure Payments</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-12 text-gray-600-300 text-sm">
                    © 2024 Subscription Manager. All rights reserved.
                </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="lg:hidden mb-10 text-center">
                        <h2 className="text-3xl font-extrabold text-black">Subscription Manager</h2>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;

