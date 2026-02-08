import axios from 'axios';
import { setupMockAdapter } from './mock';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Setup mock adapter for development
if (import.meta.env.DEV) {
    setupMockAdapter(api);
}

export default api;
