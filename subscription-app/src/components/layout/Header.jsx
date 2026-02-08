import React from 'react';
import { Menu, Bell } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
                type="button"
                className="text-gray-500 lg:hidden hover:text-gray-700 focus:outline-none"
                onClick={onMenuClick}
            >
                <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 flex justify-end">
                <div className="ml-4 flex items-center md:ml-6 space-x-4">

                    <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-6 w-6" />
                    </button>

                    {/* User Dropdown / Profile */}
                    <div className="relative flex items-center cursor-default">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                            {user?.name || 'User'}
                        </span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 hidden md:block border border-gray-200 capitalize">
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
