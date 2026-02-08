import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import { useAuth } from '../../hooks/useAuth';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const response = await api.get('/payments');
                let data = response.data;
                if (user?.role === 'customer') {
                    data = data.filter(p => p.customerEmail === user.email);
                }
                setPayments(data);
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const columns = [
        { header: 'Payment ID', accessor: 'id', render: (row) => <span className="font-mono text-xs">#{row.id}</span> },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', accessor: 'amount', render: (row) => `₹${row.amount}` },
        { header: 'Method', accessor: 'method' },
        { header: 'Customer', accessor: 'customerEmail', render: (row) => <span className="text-sm text-gray-500">{row.customerEmail}</span> },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                    {row.status}
                </span>
            )
        }
    ];

    if (loading) return <div className="p-6">Loading payments...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">
                {user?.role === 'customer' ? 'My Payments' : 'Payments'}
            </h1>
            <DataTable
                columns={columns}
                data={payments}
                isLoading={loading}
            />
        </div>
    );
};

export default PaymentList;
