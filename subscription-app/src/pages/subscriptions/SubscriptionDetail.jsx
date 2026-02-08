import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Check, X, Ban, Printer } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const SubscriptionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const res = await api.get(`/subscriptions/${id}`);
                setSubscription(res.data);
            } catch (err) {
                toast.error("Failed to load subscription");
                navigate('/subscriptions');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [id, navigate]);

    const handleStatusChange = async (newStatus) => {
        try {
            // Update status
            const updated = { ...subscription, status: newStatus };
            await api.put(`/subscriptions/${id}`, updated);
            setSubscription(updated);
            toast.success(`Subscription status updated to ${newStatus}`);

            // Logic for auto-creating invoice on confirm could go here
            if (newStatus === 'confirmed') {
                // Mock invoice creation
                toast.success("Draft Invoice Created");
            }

        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!subscription) return <div className="p-6">Subscription not found</div>;

    const isAdminOrInternal = user?.role === 'admin' || user?.role === 'internal';
    const isCustomer = user?.role === 'customer';

    // Status Flow: Draft -> Quotation -> Confirmed -> Active -> Closed
    const steps = ['draft', 'quotation', 'confirmed', 'active', 'closed'];
    const currentStepIdx = steps.indexOf(subscription.status) !== -1 ? steps.indexOf(subscription.status) : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/subscriptions')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900">Subscription #{subscription.id} - {subscription.customerName}</h1>
                        <p className="text-sm text-gray-500">Created on {subscription.startDate || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    {/* Actions based on Status & Role */}
                    {isAdminOrInternal && subscription.status === 'draft' && (
                        <button
                            onClick={() => handleStatusChange('quotation')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
                        >
                            Send Quotation
                        </button>
                    )}
                    {isAdminOrInternal && (subscription.status === 'draft' || subscription.status === 'quotation') && (
                        <button
                            onClick={() => handleStatusChange('confirmed')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700"
                        >
                            Confirm
                        </button>
                    )}
                    {isAdminOrInternal && subscription.status === 'confirmed' && (
                        <button
                            onClick={() => handleStatusChange('active')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
                        >
                            Activate
                        </button>
                    )}
                    {subscription.status === 'active' && (
                        <button
                            onClick={() => handleStatusChange('closed')}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
                        >
                            Close Subscription
                        </button>
                    )}
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50">
                        <Printer className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
                <div className="w-full py-6">
                    <div className="flex">
                        {steps.map((step, idx) => (
                            <div key={step} className="flex-1">
                                <div className={`h-2 border-t-4 ${idx <= currentStepIdx ? 'border-secondary-600' : 'border-gray-200'} rounded`}></div>
                                <div className={`text-xs font-medium uppercase mt-2 text-center ${idx <= currentStepIdx ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {step}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Lines</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Mock Order Lines derived from Plan for now since we don't store them deep yet */}
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {subscription.planName || 'Plan Service'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            1.00
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            ₹{subscription.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                            ₹{subscription.amount}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Subtotal: ₹{subscription.amount}</p>
                                <p className="text-sm text-gray-500">Taxes: ₹0.00</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">Total: ₹{subscription.amount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Details</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subscription.customerName}</dd>
                                </div>
                                <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subscription.customerEmail}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Dates</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subscription.startDate}</dd>
                                </div>
                                <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Next Billing</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subscription.nextBillingDate}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetail;
