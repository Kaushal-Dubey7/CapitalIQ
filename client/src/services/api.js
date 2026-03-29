import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ciq_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('ciq_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
