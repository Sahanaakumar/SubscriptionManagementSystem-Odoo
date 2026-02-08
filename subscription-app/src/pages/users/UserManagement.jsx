import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onSubmit = async (data) => {
        try {
            // Force role to internal if created here? Or allow selection?
            // Prompt says: "Create Internal Users".
            const payload = { ...data, role: 'internal' };
            await api.post('/auth/signup', payload); // Use signup endpoint for correct mock logic or /users for generic?
            // mock.js has /auth/signup which adds to users list. Generic /users POST also works but is less "auth-aware" maybe?
            // Actually /auth/signup returns token etc. /users just adds record.
            // Let's use /users because we don't need a token for the new user, just the record.
            // But mock.js /users generic handler might not check email uniqueness as strictly as /auth/signup.
            // Let's use /auth/signup but ignore token.

            toast.success("Internal user created");
            setShowForm(false);
            reset();
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user");
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        {
            header: 'Role',
            accessor: 'role',
            render: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${row.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        row.role === 'internal' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                    }`}>
                    {row.role}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage internal users and view customer list.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    {showForm ? <X className="-ml-1 mr-2 h-5 w-5" /> : <Plus className="-ml-1 mr-2 h-5 w-5" />}
                    {showForm ? 'Cancel' : 'Add Internal User'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">New Internal User</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="sm:col-span-6 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create User
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <DataTable
                columns={columns}
                data={users}
                isLoading={loading}
            />
        </div>
    );
};

export default UserManagement;
