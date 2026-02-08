import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard,
    CreditCard,
    Package,
    Users,
    FileText,
    Settings,
    LogOut,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    const allNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, allowedRoles: ['admin', 'internal', 'customer'] },
        // Customer specific naming
        { name: user?.role === 'customer' ? 'My Subscriptions' : 'Subscriptions', href: '/subscriptions', icon: CreditCard, allowedRoles: ['admin', 'internal', 'customer'] },

        { name: 'Products', href: '/products', icon: Package, allowedRoles: ['admin', 'internal'] },
        { name: 'Plans', href: '/plans', icon: Package, allowedRoles: ['admin'] }, // Admin only per request? Or Internal too? Prompt says "Recurring Plans" for Admin. prompt says Internal Sidebar: Products (View Only), Subscriptions, Invoices, Payments, Customers, Reports, Profile. NO Plans listed for Internal.

        { name: user?.role === 'customer' ? 'My Invoices' : 'Invoices', href: '/invoices', icon: FileText, allowedRoles: ['admin', 'internal', 'customer'] },
        { name: 'Payments', href: '/payments', icon: CreditCard, allowedRoles: ['admin', 'internal', 'customer'] },

        { name: 'Customers', href: '/customers', icon: Users, allowedRoles: ['admin', 'internal'] },

        // Admin Only
        { name: 'Users', href: '/users', icon: Users, allowedRoles: ['admin'] },
        { name: 'Reports', href: '/reports', icon: FileText, allowedRoles: ['admin', 'internal'] },
        { name: 'Settings', href: '/settings', icon: Settings, allowedRoles: ['admin'] },
    ];

    const navigation = allNavigation.filter(item => item.allowedRoles.includes(user?.role));

    // Mobile overlay and Sidebar code...
    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-6 bg-blue-950">
                    <span className="text-xl font-bold truncate" title={user?.name || 'SubManager'}>
                        {user?.name || 'SubManager'}
                    </span>
                    <button onClick={onClose} className="lg:hidden text-gray-300 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-blue-800">
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-blue-800 hover:text-white transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
