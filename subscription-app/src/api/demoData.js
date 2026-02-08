
// Demo Data Configuration

export const PROFILES = {
    FRESH: {
        email: 'fresh@demo.com',
        password: 'Demo@123',
        name: 'Fresh Customer',
        role: 'customer',
        isEmpty: true
    },
    SUBSCRIBED: {
        email: 'subscribed@demo.com',
        password: 'Demo@123',
        name: 'Subscribed Customer',
        role: 'customer',
        isEmpty: false
    },

    INTERNAL: {
        email: 'internal@demo.com',
        password: 'internal',
        name: 'Internal User',
        role: 'internal',
        isEmpty: false
    },
    FRESH_USER: {
        email: 'fresh@demo.com',
        password: 'user',
        name: 'Fresh User',
        role: 'customer',
        isEmpty: true
    },
    ADMIN_DEMO: {
        email: 'admin@demo.com',
        password: 'admin',
        name: 'Demo Admin',
        role: 'admin',
        isEmpty: false
    }
};

export const DEMO_PRODUCTS = [
    { id: 1, name: 'SaaS Starter Kit', type: 'service', price: 29.00, cost: 0.00, taxId: 1, sku: 'SKU-001', category: 'Software' },
    { id: 2, name: 'SaaS Pro License', type: 'service', price: 99.00, cost: 0.00, taxId: 1, sku: 'SKU-002', category: 'Software' },
    { id: 3, name: 'Consulting Hour', type: 'service', price: 150.00, cost: 50.00, taxId: 2, sku: 'SKU-003', category: 'Services' },
    { id: 4, name: 'Dedicated Server', type: 'service', price: 299.00, cost: 100.00, taxId: 1, sku: 'SKU-004', category: 'Hosting' },
];

export const DEMO_PLANS = [
    { id: 1, name: 'Monthly Basic', price: 29.00, billingPeriod: 'monthly', interval: 1, active: true },
    { id: 2, name: 'Yearly Basic', price: 290.00, billingPeriod: 'yearly', interval: 1, active: true },
    { id: 3, name: 'Monthly Pro', price: 99.00, billingPeriod: 'monthly', interval: 1, active: true },
    { id: 4, name: 'Yearly Pro', price: 990.00, billingPeriod: 'yearly', interval: 1, active: true },
];

export const DEMO_TAXES = [
    { id: 1, name: 'VAT 20%', percent: 20, type: 'percent', inclusive: false, active: true },
    { id: 2, name: 'Service Tax 10%', percent: 10, type: 'percent', inclusive: false, active: true },
    { id: 3, name: 'No Tax', percent: 0, type: 'percent', inclusive: false, active: true },
];

export const DEMO_DISCOUNTS = [
    { id: 1, name: 'Early Bird', type: 'percent', value: 10, code: 'EARLY10', active: true },
    { id: 2, name: 'Flat ₹50 Off', type: 'fixed', value: 50, code: 'FLAT50', active: true },
];

export const DEMO_SUBSCRIPTIONS = [
    {
        id: 101,
        customerId: 'user-subscribed', // mapped in mock.js
        customerName: 'Subscribed Customer',
        customerEmail: 'subscribed@demo.com',
        planId: 3,
        planName: 'Monthly Pro',
        status: 'active',
        startDate: '2026-01-01',
        nextBillingDate: '2026-02-01',
        amount: 99.00,
        currency: 'INR'
    },
    {
        id: 102,
        customerId: 'user-subscribed',
        customerName: 'Subscribed Customer',
        customerEmail: 'subscribed@demo.com',
        planId: 1,
        planName: 'Monthly Basic',
        status: 'active',
        startDate: '2026-01-15',
        nextBillingDate: '2026-02-15',
        amount: 29.00,
        currency: 'INR'
    }
];

export const DEMO_INVOICES = [
    {
        id: 'INV-2026-001',
        customerId: 'user-subscribed',
        customerName: 'Subscribed Customer',
        customerEmail: 'subscribed@demo.com',
        date: '2026-01-01',
        dueDate: '2026-01-15',
        total: 99.00,
        taxTotal: 19.80,
        subtotal: 99.00,
        status: 'paid',
        paymentStatus: 'paid'
    },
    {
        id: 'INV-2026-002',
        customerId: 'user-subscribed',
        customerName: 'Subscribed Customer',
        customerEmail: 'subscribed@demo.com',
        date: '2026-01-15',
        dueDate: '2026-01-30',
        total: 29.00,
        taxTotal: 5.80,
        subtotal: 29.00,
        status: 'pending',
        paymentStatus: 'unpaid'
    }
];

export const DEMO_PAYMENTS = [
    {
        id: 'PAY-001',
        invoiceId: 'INV-2026-001',
        date: '2026-01-05',
        amount: 99.00,
        method: 'credit_card',
        status: 'confirmed',
        customerEmail: 'subscribed@demo.com'
    }
];

export const getAllDemoUsers = () => {
    // Generate IDs deterministically for demo purposes if possible, or random
    const users = Object.values(PROFILES).map(p => {
        let id = 'user-' + p.email.split('@')[0];
        return {
            ...p,
            id: id,
            isFirstLogin: false
        };
    });
    return users;
};
