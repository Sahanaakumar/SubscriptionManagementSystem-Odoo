
import {
    getAllDemoUsers,
    DEMO_PRODUCTS,
    DEMO_PLANS,
    DEMO_SUBSCRIPTIONS,
    DEMO_INVOICES,
    DEMO_PAYMENTS,
    DEMO_TAXES,
    DEMO_DISCOUNTS
} from './demoData.js';

// --- IN-MEMORY DATABASE ---
// Initialize with demo data
let users = getAllDemoUsers();
let products = [...DEMO_PRODUCTS];
let plans = [...DEMO_PLANS];
let subscriptions = [...DEMO_SUBSCRIPTIONS];
let invoices = [...DEMO_INVOICES];
let payments = [...DEMO_PAYMENTS];
let taxes = [...DEMO_TAXES];
let discounts = [...DEMO_DISCOUNTS];

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get user from token
const getUserFromToken = (config) => {
    const authHeader = config.headers?.Authorization || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.replace('Bearer ', '');
    // Simple token strategy: "mock-token-{email}-{timestamp}"
    // We look for the email inside the token string
    const user = users.find(u => token.includes(u.email));
    return user || null;
};

export const setupMockAdapter = (axiosInstance) => {
    axiosInstance.interceptors.request.use(async (config) => {
        await delay(300); // 300ms latency

        // Normalize URL
        let url = config.url || '';
        if (url.startsWith('/api')) url = url.substring(4);
        if (!url.startsWith('/')) url = '/' + url;

        const method = config.method.toLowerCase();
        const data = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

        console.log(`[Mock API] ${method.toUpperCase()} ${url}`, data);

        // --- AUTH ---

        if (url === '/auth/login' && method === 'post') {
            const { email, password } = data;
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                const token = `mock-token-${user.email}-${Date.now()}`;
                return { ...config, adapter: () => Promise.resolve({ data: { token, user }, status: 200 }) };
            }
            return { ...config, adapter: () => Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials' } } }) };
        }

        if (url === '/auth/signup' && method === 'post') {
            const { email, password, name, role } = data;
            if (users.find(u => u.email === email)) {
                return { ...config, adapter: () => Promise.reject({ response: { status: 400, data: { message: 'User already exists' } } }) };
            }
            const newUser = { id: `user-${Date.now()}`, email, password, name, role: role || 'customer', isFirstLogin: true };
            users.push(newUser);
            const token = `mock-token-${email}-${Date.now()}`;
            return { ...config, adapter: () => Promise.resolve({ data: { token, user: newUser }, status: 201 }) };
        }

        if (url === '/auth/me' && method === 'get') {
            const user = getUserFromToken(config);
            if (user) return { ...config, adapter: () => Promise.resolve({ data: user, status: 200 }) };
            return { ...config, adapter: () => Promise.reject({ response: { status: 401 } }) };
        }

        // --- GENERIC CRUD HANDLER ---
        const handleCrud = (collection, baseUrl, idField = 'id') => {
            // LIST
            if (url === baseUrl && method === 'get') {
                return { ...config, adapter: () => Promise.resolve({ data: collection, status: 200 }) };
            }
            // CREATE
            if (url === baseUrl && method === 'post') {
                const newItem = { ...data, [idField]: data[idField] || Date.now() + Math.random().toString(36).substr(2, 5) };
                collection.push(newItem);
                return { ...config, adapter: () => Promise.resolve({ data: newItem, status: 201 }) };
            }
            // GET ONE
            const matchId = url.match(new RegExp(`^${baseUrl}/([^/]+)$`));
            if (matchId && method === 'get') {
                const id = matchId[1];
                // Try comparing as string and number
                const item = collection.find(i => i[idField] == id);
                if (item) return { ...config, adapter: () => Promise.resolve({ data: item, status: 200 }) };
                return { ...config, adapter: () => Promise.reject({ response: { status: 404 } }) };
            }
            // UPDATE
            if (matchId && (method === 'put' || method === 'patch')) {
                const id = matchId[1];
                const index = collection.findIndex(i => i[idField] == id);
                if (index !== -1) {
                    collection[index] = { ...collection[index], ...data };
                    return { ...config, adapter: () => Promise.resolve({ data: collection[index], status: 200 }) };
                }
                return { ...config, adapter: () => Promise.reject({ response: { status: 404 } }) };
            }
            // DELETE
            if (matchId && method === 'delete') {
                const id = matchId[1];
                const index = collection.findIndex(i => i[idField] == id);
                if (index !== -1) {
                    collection.splice(index, 1);
                    return { ...config, adapter: () => Promise.resolve({ data: { success: true }, status: 200 }) };
                }
                return { ...config, adapter: () => Promise.reject({ response: { status: 404 } }) };
            }
            return null;
        };

        // --- SPECIFIC DOMAIN LOGIC ---

        // Subscriptions (Filter by User)
        if (url === '/subscriptions' && method === 'get') {
            const user = getUserFromToken(config);
            let result = subscriptions;
            if (user && user.role === 'customer') {
                result = subscriptions.filter(s => s.customerId === user.id || s.customerEmail === user.email);
            }
            return { ...config, adapter: () => Promise.resolve({ data: result, status: 200 }) };
        }

        // Invoices (Filter by User)
        if (url === '/invoices' && method === 'get') {
            const user = getUserFromToken(config);
            let result = invoices;
            if (user && user.role === 'customer') {
                result = invoices.filter(i => i.customerId === user.id || i.customerEmail === user.email);
            }
            return { ...config, adapter: () => Promise.resolve({ data: result, status: 200 }) };
        }

        // Payments (Filter by User)
        if (url === '/payments' && method === 'get') {
            const user = getUserFromToken(config);
            let result = payments;
            if (user && user.role === 'customer') {
                result = payments.filter(p => p.customerEmail === user.email);
            }
            return { ...config, adapter: () => Promise.resolve({ data: result, status: 200 }) };
        }

        // Dashboard Stats (Dynamic)
        if (url === '/dashboard/stats' && method === 'get') {
            const user = getUserFromToken(config);
            let stats = {};

            // Filter data based on role
            const mySubs = user.role === 'customer'
                ? subscriptions.filter(s => s.customerId === user.id || s.customerEmail === user.email)
                : subscriptions;

            const myInvoices = user.role === 'customer'
                ? invoices.filter(i => i.customerId === user.id || i.customerEmail === user.email)
                : invoices;

            stats.activeSubscriptions = mySubs.filter(s => s.status === 'active').length;
            stats.pendingInvoices = myInvoices.filter(i => i.status === 'pending').length;
            stats.monthlyRevenue = myInvoices
                .filter(i => i.status === 'paid')
                .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

            // Mock Churn Rate
            stats.churnRate = '0.5%';

            // Revenue Chart Data (Mock generated based on invoices)
            // Group paid invoices by month (simplistic)
            const revenueData = [
                { name: 'Jan', revenue: 0 }, { name: 'Feb', revenue: 0 }, { name: 'Mar', revenue: 0 },
                { name: 'Apr', revenue: 0 }, { name: 'May', revenue: 0 }, { name: 'Jun', revenue: 0 }
            ];
            // Simple logic: distribute total revenue somewhat randomly or based on actual invoice dates if parsed
            // For now, just a placeholder that scales with real revenue
            const base = stats.monthlyRevenue / 6;
            revenueData.forEach(d => d.revenue = Math.floor(base + Math.random() * base * 0.5));
            stats.revenueData = revenueData;

            return { ...config, adapter: () => Promise.resolve({ data: stats, status: 200 }) };
        }

        // Apply CRUD for all standart entities
        const crudHandlers = [
            handleCrud(products, '/products'),
            handleCrud(plans, '/plans'),
            handleCrud(users, '/users'), // Admin only usually, but we'll allow for demo
            handleCrud(taxes, '/taxes'),
            handleCrud(discounts, '/discounts'),
            handleCrud(subscriptions, '/subscriptions'), // Fallback for POST/PUT/DELETE
            handleCrud(invoices, '/invoices'),           // Fallback for POST/PUT/DELETE
            handleCrud(payments, '/payments'),           // Fallback for POST/PUT/DELETE
        ];

        for (const handler of crudHandlers) {
            if (handler) return handler;
        }

        // Pass through if no match
        return config;
    });
};
