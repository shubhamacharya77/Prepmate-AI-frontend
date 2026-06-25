import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Request interceptor — attach Bearer token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prepmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('prepmate_token');
      localStorage.removeItem('prepmate_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
