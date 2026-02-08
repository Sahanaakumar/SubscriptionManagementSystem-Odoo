import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CreditCard, Send } from 'lucide-react';
import api from '../../api/client';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await api.get(`/invoices/${id}`);
                setInvoice(res.data);
            } catch (err) {
                toast.error("Failed to load invoice");
                navigate('/invoices');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id, navigate]);

    const handlePayment = async () => {
        // Mock payment registration
        try {
            // Update invoice status
            const updated = { ...invoice, status: 'paid', paymentStatus: 'paid' };
            await api.put(`/invoices/${id}`, updated);

            // Create payment record
            await api.post('/payments', {
                invoiceId: id,
                date: new Date().toISOString().split('T')[0],
                amount: invoice.total,
                method: 'Manual/Cash',
                status: 'confirmed',
                customerEmail: invoice.customerEmail
            });

            setInvoice(updated);
            toast.success("Payment registered successfully");
        } catch (err) {
            toast.error("Failed to register payment");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!invoice) return <div className="p-6">Invoice not found</div>;

    const isPending = invoice.status === 'pending' || invoice.status === 'draft';
    const canRegisterPayment = (user?.role === 'admin' || user?.role === 'internal') && isPending;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/invoices')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900">Invoice #{invoice.id} for {invoice.customerName}</h1>
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 flex items-center print:hidden"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        Send by Email
                    </button>
                    {canRegisterPayment && (
                        <button
                            onClick={handlePayment}
                            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700 flex items-center"
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Register Payment
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                {/* Header Info */}
                <div className="px-6 py-8 border-b border-gray-200 bg-gray-50 flex justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Customer</h3>
                        <p className="mt-1 text-lg font-semibold text-blue-900">{invoice.customerName}</p>
                        <p className="text-gray-600">{invoice.customerEmail}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">Amount Due</h3>
                        <p className="mt-1 text-2xl font-bold text-blue-600">₹{invoice.total}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2 ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>

                {/* Line Items */}
                <div className="px-6 py-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Description</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Quantity</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Unit Price</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* Assuming single line for demo if lines missing, usually mock data might not have detailed lines yet */}
                            <tr>
                                <td className="py-4 text-sm text-black">Subscription Service (Standard)</td>
                                <td className="py-4 text-sm text-gray-500 text-right">1.00</td>
                                <td className="py-4 text-sm text-gray-500 text-right">₹{invoice.subtotal}</td>
                                <td className="py-4 text-sm text-black text-right">₹{invoice.subtotal}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end">
                        <div className="w-1/3 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{invoice.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Taxes</span>
                                <span>₹{invoice.taxTotal || 0}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2 flex justify-between text-base font-bold text-blue-900">
                                <span>Total</span>
                                <span>₹{invoice.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;
