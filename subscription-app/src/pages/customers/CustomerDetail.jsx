import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { ArrowLeft, Mail, Phone, Calendar, CreditCard, FileText, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                const [customerRes, subscriptionsRes, invoicesRes, paymentsRes] = await Promise.all([
                    api.get(`/users/${id}`),
                    api.get('/subscriptions'),
                    api.get('/invoices'),
                    api.get('/payments')
                ]);

                setCustomer(customerRes.data);

                // Filter data for this customer
                const customerEmail = customerRes.data.email;
                setSubscriptions(subscriptionsRes.data.filter(sub => sub.customerEmail === customerEmail));
                setInvoices(invoicesRes.data.filter(inv => inv.customerEmail === customerEmail));
                setPayments(paymentsRes.data.filter(pay => pay.customerEmail === customerEmail));
            } catch (error) {
                console.error("Failed to fetch customer data", error);
                toast.error("Failed to load customer details");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, [id]);

    if (loading) return <div className="p-6">Loading customer details...</div>;
    if (!customer) return <div className="p-6">Customer not found</div>;

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
            paid: 'bg-green-100 text-green-800',
            unpaid: 'bg-red-100 text-red-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/customers')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Customer Details</h1>
                        <p className="text-sm text-gray-500">View complete customer information</p>
                    </div>
                </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-3xl">
                            {customer.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{customer.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center text-gray-500 text-xs mb-1">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email Address
                                </div>
                                <p className="font-medium text-gray-900 text-sm">{customer.email}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-gray-500 text-xs mb-1">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Mobile Number
                                </div>
                                <p className="font-semibold text-gray-900 text-lg">
                                    {customer.phone || '9876543210'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-gray-500 text-xs mb-1">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Joined Date
                                </div>
                                <p className="font-semibold text-gray-900 text-lg">
                                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : '15 Jan 2024'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(customer.status || 'active')}`}>
                                {customer.status || 'Active'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-blue-600">
                                ₹{(payments.reduce((sum, p) => sum + (p.amount || 0), 0) || 0).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <CreditCard className="w-10 h-10 text-blue-600 opacity-20" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Subscriptions</p>
                            <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
                        </div>
                        <Package className="w-10 h-10 text-blue-600 opacity-20" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Invoices</p>
                            <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                        </div>
                        <FileText className="w-10 h-10 text-green-600 opacity-20" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Payments</p>
                            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                        </div>
                        <CreditCard className="w-10 h-10 text-purple-600 opacity-20" />
                    </div>
                </div>
            </div>

            {/* Subscriptions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
                </div>
                <div className="p-6">
                    {subscriptions.length > 0 ? (
                        <div className="space-y-4">
                            {subscriptions.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">Subscription #{sub.id}</p>
                                        <p className="text-sm text-gray-600 mt-1">{sub.planName}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Started: {sub.startDate ? new Date(sub.startDate).toLocaleDateString('en-IN') : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500">Amount</p>
                                            <p className="text-2xl font-bold text-blue-600">₹{sub.amount?.toLocaleString()}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No subscriptions found</p>
                    )}
                </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
                </div>
                <div className="p-6">
                    {invoices.length > 0 ? (
                        <div className="space-y-4">
                            {invoices.slice(0, 5).map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">Invoice #{invoice.id}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Date: {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500">Total Amount</p>
                                            <p className="text-2xl font-bold text-green-600">₹{invoice.totalAmount?.toLocaleString()}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No invoices found</p>
                    )}
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                </div>
                <div className="p-6">
                    {payments.length > 0 ? (
                        <div className="space-y-4">
                            {payments.slice(0, 5).map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">Payment #{payment.id}</p>
                                        <p className="text-sm text-gray-600 mt-1">{payment.paymentMethod}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Amount Paid</p>
                                            <p className="text-2xl font-bold text-purple-600">₹{payment.amount?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No payments found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
