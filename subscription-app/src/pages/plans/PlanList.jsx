import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PlanList = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await api.get('/plans');
            setPlans(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleDelete = async (row) => {
        if (!window.confirm(`Are you sure you want to delete ${row.name}?`)) return;
        try {
            await api.delete(`/plans/${row.id}`);
            toast.success("Plan deleted");
            fetchPlans();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete plan");
        }
    };

    const columns = [
        { header: 'Plan Name', accessor: 'name', render: (row) => <span className="font-medium text-gray-900">{row.name}</span> },
        {
            header: 'Cycle', accessor: 'cycle', render: (row) => (
                <span className="px-2 py-1 rounded-full bg-gray-100 text-xs text-black">
                    {row.interval} {row.billingPeriod}(s)
                </span>
            )
        },
        { header: 'Price', accessor: 'price', render: (row) => `₹${row.price}` },
        {
            header: 'Active', accessor: 'active', render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.active ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {row.active ? 'Active' : 'Archived'}
                </span>
            )
        },
    ];

    if (loading) return <div>Loading plans...</div>;

    const canManagePlans = user?.role === 'admin';

    return (
        <div className="space-y-6">
            <div className="flex sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Plans</h1>
                    <p className="mt-1 text-sm text-gray-500">Configure subscription plans and pricing.</p>
                </div>
                {canManagePlans && (
                    <button
                        onClick={() => navigate('/plans/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Create Plan
                    </button>
                )}
            </div>
            <DataTable
                columns={columns}
                data={plans}
                isLoading={loading}
                onEdit={canManagePlans ? (row) => navigate(`/plans/${row.id}`) : null}
                onDelete={canManagePlans ? handleDelete : null}
            />
        </div>
    );
};

export default PlanList;
