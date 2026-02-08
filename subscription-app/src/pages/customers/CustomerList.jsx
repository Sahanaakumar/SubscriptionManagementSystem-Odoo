import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import { Mail, Phone, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users');
                // Filter only customers
                const customerData = response.data.filter(user => user.role === 'customer');
                setCustomers(customerData);
            } catch (error) {
                console.error("Failed to fetch customers", error);
                toast.error("Failed to load customers");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            suspended: 'bg-red-100 text-red-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const columns = [
        {
            header: 'ID',
            accessor: 'id',
            render: (row) => <span className="font-mono text-xs">#{row.id}</span>
        },
        {
            header: 'Name',
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">
                            {row.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="font-medium text-gray-900">{row.name}</span>
                </div>
            )
        },
        {
            header: 'Email',
            accessor: 'email',
            render: (row) => (
                <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {row.email}
                </div>
            )
        },
        {
            header: 'Mobile Number',
            accessor: 'phone',
            render: (row) => (
                <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{row.phone || '9876543210'}</span>
                </div>
            )
        },
        {
            header: 'Joined Date',
            accessor: 'createdAt',
            render: (row) => (
                <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) : '15 Jan 2024'}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(row.status || 'active')}`}>
                    {row.status || 'Active'}
                </span>
            )
        },
    ];

    if (loading) return <div className="p-6">Loading customers...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your customer base and view their details
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center">
                            <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                            <div>
                                <p className="text-xs text-gray-500">Total Customers</p>
                                <p className="text-lg font-semibold text-gray-900">{customers.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={customers}
                isLoading={loading}
                onView={(row) => navigate(`/customers/${row.id}`)}
            />
        </div>
    );
};

export default CustomerList;
