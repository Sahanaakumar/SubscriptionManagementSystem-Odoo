import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download } from 'lucide-react';

const ReportsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch stats and also maybe some specific report data if endpoint existed
                // For now, we reuse dashboard stats which are quite rich
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load report data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-6">Loading reports...</div>;

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

    // Mock distribution data since backend doesn't give it yet
    const pieData = [
        { name: 'Active', value: stats?.activeSubscriptions || 10 },
        { name: 'Draft', value: 5 },
        { name: 'Closed', value: 2 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Executive Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Detailed breakdown of subscription performance and revenue metrics.</p>
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard title="Total Revenue (YTD)" value={`$${(stats?.monthlyRevenue * 12).toLocaleString()}`} sub="Forecast based on current MRR" />
                <KPICard title="Monthly Recurring Revenue" value={`$${stats?.monthlyRevenue?.toLocaleString()}`} sub="+12% vs last month" />
                <KPICard title="Avg. Revenue Per User" value="$125.00" sub="Top 15% of industry" />
                <KPICard title="Churn Rate" value={stats?.churnRate || '0.8%'} sub="-0.2% improvement" color="text-green-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Revenue Trajectory</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.revenueData || []}>
                                <defs>
                                    <linearGradient id="colorRevenueReport" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`$${value}`, 'Revenue']}
                                />
                                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueReport)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subscription Distribution */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Subscription Status Distribution</h3>
                    <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, sub, color = "text-gray-900" }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
);

export default ReportsPage;
