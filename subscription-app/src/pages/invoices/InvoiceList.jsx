import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const response = await api.get('/invoices');
                setInvoices(response.data);
            } catch (error) {
                console.error("Failed to fetch invoices", error);
                toast.error("Failed to load invoices");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            draft: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-blue-100 text-blue-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const columns = [
        { header: 'Invoice ID', accessor: 'id', render: (row) => <span className="font-mono text-xs">#{row.id}</span> },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Date', accessor: 'date' },
        { header: 'Due Date', accessor: 'dueDate' },
        { header: 'Total', accessor: 'total', render: (row) => `₹${row.total}` },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(row.status)}`}>
                    {row.status}
                </span>
            )
        }
    ];

    if (loading) return <div className="p-6">Loading invoices...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">
                {user?.role === 'customer' ? 'My Invoices' : 'Invoices'}
            </h1>
            <DataTable
                columns={columns}
                data={invoices}
                isLoading={loading}
                onView={(row) => navigate(`/invoices/${row.id}`)}
            />
        </div>
    );
};

export default InvoiceList;
