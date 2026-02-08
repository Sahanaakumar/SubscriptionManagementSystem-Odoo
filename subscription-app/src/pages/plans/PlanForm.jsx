import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../api/client';

const PlanForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            price: 0,
            billingPeriod: 'monthly',
            interval: 1,
            active: true,
            renewable: true,
            closable: true,
            pausable: false,
        }
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchPlan = async () => {
                try {
                    setLoading(true);
                    const res = await api.get(`/plans/${id}`);
                    reset(res.data);
                } catch (err) {
                    toast.error("Failed to load plan");
                    navigate('/plans');
                } finally {
                    setLoading(false);
                }
            };
            fetchPlan();
        }
    }, [isEditMode, id, reset, navigate]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const payload = {
                ...data,
                price: parseFloat(data.price),
                interval: parseInt(data.interval)
            };

            if (isEditMode) {
                await api.put(`/plans/${id}`, payload);
                toast.success("Plan updated successfully");
            } else {
                await api.post('/plans', payload);
                toast.success("Plan created successfully");
            }
            navigate('/plans');
        } catch (err) {
            console.error(err);
            toast.error("Failed to save plan");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/plans')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {isEditMode ? 'Edit Plan' : 'Create Plan'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    {loading ? 'Saving...' : 'Save Plan'}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Plan name is required' })}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            />
                            {errors.name && <p className="mt-1 text-sm text-blue-600">{errors.name.message}</p>}
                        </div>

                        <div className="col-span-6 sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price', { required: true, min: 0 })}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </div>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Billing Period</label>
                            <select
                                {...register('billingPeriod')}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Interval Count</label>
                            <input
                                type="number"
                                min="1"
                                {...register('interval')}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            />
                            <p className="mt-1 text-xs text-gray-500">e.g. 1 Month, 3 Weeks</p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <fieldset>
                            <legend className="text-base font-medium text-gray-900">Options</legend>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            {...register('active')}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label className="font-medium text-gray-700">Active</label>
                                        <p className="text-gray-500">Available for new subscriptions.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            {...register('renewable')}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label className="font-medium text-gray-700">Renewable</label>
                                        <p className="text-gray-500">Subscription auto-renews.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            {...register('closable')}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label className="font-medium text-gray-700">Closable by Customer</label>
                                        <p className="text-gray-500">Customer can close subscription from portal.</p>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlanForm;
