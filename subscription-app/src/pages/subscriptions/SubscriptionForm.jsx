import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

const SubscriptionForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [discounts, setDiscounts] = useState([]);

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedTax, setSelectedTax] = useState(null);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            customerId: '',
            planId: '',
            taxId: '',
            discountId: '',
            startDate: new Date().toISOString().split('T')[0],
        }
    });

    const watchPlanId = watch('planId');
    const watchTaxId = watch('taxId');
    const watchDiscountId = watch('discountId');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [usersRes, plansRes, taxesRes, discountsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/plans'),
                    api.get('/taxes'),
                    api.get('/discounts')
                ]);
                setCustomers(usersRes.data.filter(u => u.role === 'customer'));
                setPlans(plansRes.data.filter(p => p.active));
                setTaxes(taxesRes.data.filter(t => t.active));
                setDiscounts(discountsRes.data.filter(d => d.active));
            } catch (err) {
                toast.error("Failed to load required data");
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const plan = plans.find(p => p.id == watchPlanId);
        setSelectedPlan(plan || null);
    }, [watchPlanId, plans]);

    useEffect(() => {
        const tax = taxes.find(t => t.id == watchTaxId);
        setSelectedTax(tax || null);
    }, [watchTaxId, taxes]);

    useEffect(() => {
        const discount = discounts.find(d => d.id == watchDiscountId);
        setSelectedDiscount(discount || null);
    }, [watchDiscountId, discounts]);

    const calculateTotals = () => {
        if (!selectedPlan) return { subtotal: 0, taxAmount: 0, discountAmount: 0, total: 0 };

        const subtotal = selectedPlan.price;

        let discountAmount = 0;
        if (selectedDiscount) {
            if (selectedDiscount.type === 'percent') {
                discountAmount = subtotal * (selectedDiscount.value / 100);
            } else {
                discountAmount = selectedDiscount.value;
            }
        }

        const taxableBase = Math.max(0, subtotal - discountAmount);

        let taxAmount = 0;
        if (selectedTax) {
            if (selectedTax.type === 'percent') {
                taxAmount = taxableBase * (selectedTax.percent / 100);
            } else {
                // Fixed tax logic if supported? Assuming percent mostly.
                taxAmount = 0;
            }
        }

        const total = taxableBase + taxAmount;

        return {
            subtotal: subtotal.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            total: total.toFixed(2)
        };
    };

    const totals = calculateTotals();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const customer = customers.find(c => c.id == data.customerId);
            const plan = plans.find(p => p.id == data.planId);

            const payload = {
                customerId: customer.id,
                customerName: customer.name,
                customerEmail: customer.email,
                planId: plan.id,
                planName: plan.name,
                startDate: data.startDate,
                status: 'draft',
                amount: parseFloat(totals.total),
                subtotal: parseFloat(totals.subtotal),
                taxAmount: parseFloat(totals.taxAmount),
                discountAmount: parseFloat(totals.discountAmount),
                nextBillingDate: new Date(new Date(data.startDate).setMonth(new Date(data.startDate).getMonth() + 1)).toISOString().split('T')[0]
            };

            await api.post('/subscriptions', payload);
            toast.success("Subscription created as Draft");
            navigate('/subscriptions');
        } catch (err) {
            console.error(err);
            toast.error("Failed to create subscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/subscriptions')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">New Subscription</h1>
                </div>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    {loading ? 'Creating...' : 'Create Subscription'}
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="grid grid-cols-6 gap-6">

                        <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Customer</label>
                            <select
                                {...register('customerId', { required: 'Customer is required' })}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select a customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                ))}
                            </select>
                            {errors.customerId && <p className="mt-1 text-sm text-blue-600">{errors.customerId.message}</p>}
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Plan</label>
                            <select
                                {...register('planId', { required: 'Plan is required' })}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select a plan</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - ₹{p.price}/{p.billingPeriod === 'monthly' ? 'mo' : 'yr'}</option>
                                ))}
                            </select>
                            {errors.planId && <p className="mt-1 text-sm text-blue-600">{errors.planId.message}</p>}
                        </div>

                        <div className="col-span-6 sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                {...register('startDate', { required: 'Start Date is required' })}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            />
                        </div>

                        {/* Tax & Discount */}
                        <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Tax</label>
                            <select
                                {...register('taxId')}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">No Tax</option>
                                {taxes.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.percent}%)</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Discount</label>
                            <select
                                {...register('discountId')}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">No Discount</option>
                                {discounts.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({d.type === 'percent' ? `${d.value}%` : `₹${d.value}`})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary / Preview */}
                {selectedPlan && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">₹{totals.subtotal}</span>
                        </div>
                        {totals.discountAmount > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 text-green-600">
                                <span>Discount</span>
                                <span>-₹{totals.discountAmount}</span>
                            </div>
                        )}
                        {totals.taxAmount > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 text-gray-600">
                                <span>Tax</span>
                                <span>+₹{totals.taxAmount}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-4">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-blue-600">₹{totals.total}</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SubscriptionForm;
