import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const SubscriptionList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const isCustomer = user?.role === 'customer';

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/subscriptions');
            setSubscriptions(response.data);
        } catch (error) {
            console.error("Failed to fetch subscriptions", error);
            toast.error("Failed to load subscriptions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            overdue: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-gray-100 text-gray-800',
            closed: 'bg-gray-100 text-gray-600',
            draft: 'bg-blue-100 text-blue-800',
            quotation: 'bg-purple-100 text-purple-800',
            confirmed: 'bg-blue-600-100 text-gray-600-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const columns = [
        { header: 'ID', accessor: 'id', render: (row) => <span className="font-mono text-xs">#{row.id}</span> },
        { header: 'Customer', accessor: 'customerName', render: (row) => <span className="font-medium text-gray-900">{row.customerName}</span> },
        { header: 'Plan', accessor: 'planName' },
        { header: 'Amount', accessor: 'amount', render: (row) => `₹${row.amount}` },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(row.status)}`}>
                    {row.status}
                </span>
            )
        },
        { header: 'Next Billing', accessor: 'nextBillingDate' },
    ];

    if (loading) return <div className="p-6">Loading subscriptions...</div>;

    const canCreate = !isCustomer;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {isCustomer ? 'My Subscriptions' : 'Subscriptions'}
                </h1>
                {canCreate && (
                    <button
                        onClick={() => navigate('/subscriptions/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        New Subscription
                    </button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={subscriptions}
                isLoading={loading}
                onView={(row) => navigate(`/subscriptions/${row.id}`)}
                onEdit={!isCustomer ? (row) => navigate(`/subscriptions/${row.id}`) : undefined}
            />
        </div>
    );
};

export default SubscriptionList;
