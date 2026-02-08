
import axios from 'axios';
import { setupMockAdapter } from '../src/api/mock.js';

// Shim localStorage
global.localStorage = {
    store: {},
    getItem: function (key) { return this.store[key] || null; },
    setItem: function (key, value) { this.store[key] = value.toString(); },
    removeItem: function (key) { delete this.store[key]; },
    clear: function () { this.store = {}; }
};

async function runTest() {
    console.log('Starting Signup Flow Test...');

    const api = axios.create({
        baseURL: '/api'
    });

    setupMockAdapter(api);

    const email = `testuser_${Date.now()}@example.com`;
    const password = 'Password123!';
    const name = 'Test User';
    const role = 'customer';

    try {
        console.log(`1. Attempting Signup for ${email}...`);
        const signupRes = await api.post('/auth/signup', { name, email, password, role });
        console.log('Signup Response Status:', signupRes.status);
        console.log('Signup Data:', signupRes.data);

        if (signupRes.status !== 201) {
            throw new Error(`Signup failed with status ${signupRes.status}`);
        }

        console.log('2. Attempting Login...');
        const loginRes = await api.post('/auth/login', { email, password });
        console.log('Login Response Status:', loginRes.status);
        console.log('Login Data:', loginRes.data);

        if (loginRes.status !== 200) {
            throw new Error(`Login failed with status ${loginRes.status}`);
        }

        if (!loginRes.data.token) {
            throw new Error('Login response missing token');
        }

        if (loginRes.data.user.email !== email) {
            throw new Error('Login response user mismatch');
        }

        console.log('SUCCESS: Signup and Login flow verified.');

    } catch (error) {
        console.error('TEST FAILED:', error.message);
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }
        process.exit(1);
    }
}

runTest();
