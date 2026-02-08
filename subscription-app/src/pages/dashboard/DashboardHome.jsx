import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, Clock } from 'lucide-react';

const DashboardHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, invoicesRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/invoices')
                ]);
                setStats(statsRes.data);
                setRecentInvoices(invoicesRes.data.slice(0, 3)); // Take top 3
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-6 dark:text-gray-300">Loading dashboard...</div>;

    const canCreateSubscription = user?.role !== 'customer';
    const hasData = stats && stats.activeSubscriptions > 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-blue-900">Dashboard</h1>
                {canCreateSubscription && (
                    <button
                        onClick={() => navigate('/subscriptions/new')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-800 transition-colors"
                    >
                        New Subscription
                    </button>
                )}
            </div>

            {/* Empty State vs Populate Dashboard */}
            {!hasData ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-blue-900">Welcome, {user?.name || 'User'}!</h3>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                        {canCreateSubscription
                            ? "You don't have any active subscriptions yet. Get started by creating your first subscription."
                            : "You don't have any active subscriptions yet. Contact your administrator to get started."}
                    </p>
                    {canCreateSubscription && (
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/subscriptions/new')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                Create Subscription
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions} trend="+12%" />
                        <StatCard title="Monthly Revenue" value={`$${stats?.monthlyRevenue?.toLocaleString()}`} trend="+5.4%" />
                        <StatCard title="Pending Invoices" value={stats?.pendingInvoices} trend="-2" negative />
                        <StatCard title="Churn Rate" value={stats?.churnRate} trend="-0.1%" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 lg:col-span-2">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Revenue Overview</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.revenueData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Invoices */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Invoices</h3>
                            </div>
                            <ul className="divide-y divide-gray-200 overflow-y-auto flex-1">
                                {recentInvoices && recentInvoices.length > 0 ? (
                                    recentInvoices.map((inv) => (
                                        <li key={inv.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-full mr-3 ${inv.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{inv.id}</p>
                                                    <p className="text-xs text-gray-500">{inv.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-900">${inv.amount}</p>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {inv.status}
                                                </span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-4 text-center text-sm text-gray-500">No recent invoices</li>
                                )}
                            </ul>
                            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-500 w-full text-center">
                                    View all invoices
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const StatCard = ({ title, value, trend, negative }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`mt-2 flex items-center text-sm ${negative ? 'text-blue-600' : 'text-green-600'}`}>
            <span>{trend}</span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </div>
);

export default DashboardHome;
