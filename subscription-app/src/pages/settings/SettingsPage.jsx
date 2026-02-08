import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/client';
import DataTable from '../../components/common/DataTable';
import { Plus, X, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('taxes');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('taxes')}
                        className={`${activeTab === 'taxes'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Taxes
                    </button>
                    <button
                        onClick={() => setActiveTab('discounts')}
                        className={`${activeTab === 'discounts'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Discounts
                    </button>
                </nav>
            </div>

            {activeTab === 'taxes' && <TaxSettings />}
            {activeTab === 'discounts' && <DiscountSettings />}
        </div>
    );
};

const TaxSettings = () => {
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const fetchTaxes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/taxes');
            setTaxes(res.data);
        } catch (err) {
            toast.error("Failed to load taxes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTaxes(); }, []);

    const onSubmit = async (data) => {
        try {
            await api.post('/taxes', { ...data, percent: parseFloat(data.percent), active: true });
            toast.success("Tax created");
            setShowForm(false);
            reset();
            fetchTaxes();
        } catch (err) {
            toast.error("Failed to create tax");
        }
    };

    const handleDelete = async (row) => {
        if (!confirm('Delete tax?')) return;
        try {
            await api.delete(`/taxes/${row.id}`);
            toast.success("Tax deleted");
            fetchTaxes();
        } catch (err) {
            toast.error("Failed to delete tax");
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Rate (%)', accessor: 'percent', render: (row) => `${row.percent}%` },
        { header: 'Type', accessor: 'type', render: (row) => <span className="capitalize">{row.type}</span> },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Tax Rates</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Tax
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-md space-y-4 border border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input {...register('name', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white" placeholder="e.g. VAT" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Percentage</label>
                            <input type="number" step="0.01" {...register('percent', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white" placeholder="20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select {...register('type')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white">
                                <option value="percent">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Save</button>
                </form>
            )}

            <DataTable columns={columns} data={taxes} isLoading={loading} onDelete={handleDelete} />
        </div>
    );
};

const DiscountSettings = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/discounts');
            setDiscounts(res.data);
        } catch (err) {
            toast.error("Failed to load discounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDiscounts(); }, []);

    const onSubmit = async (data) => {
        try {
            await api.post('/discounts', { ...data, value: parseFloat(data.value), active: true });
            toast.success("Discount created");
            setShowForm(false);
            reset();
            fetchDiscounts();
        } catch (err) {
            toast.error("Failed to create discount");
        }
    };

    const handleDelete = async (row) => {
        if (!confirm('Delete discount?')) return;
        try {
            await api.delete(`/discounts/${row.id}`);
            toast.success("Discount deleted");
            fetchDiscounts();
        } catch (err) {
            toast.error("Failed to delete discount");
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Value', accessor: 'value', render: (row) => row.type === 'percent' ? `${row.value}%` : `$${row.value}` },
        { header: 'Type', accessor: 'type', render: (row) => <span className="capitalize">{row.type}</span> },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Discounts</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Discount
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-md space-y-4 border border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input {...register('name', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white" placeholder="e.g. Summer Sale" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Value</label>
                            <input type="number" step="0.01" {...register('value', { required: true })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white" placeholder="10" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select {...register('type')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white">
                                <option value="percent">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Save</button>
                </form>
            )}

            <DataTable columns={columns} data={discounts} isLoading={loading} onDelete={handleDelete} />
        </div>
    );
};

export default SettingsPage;
