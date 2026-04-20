import axios from 'axios';
import { API_URL } from './api-base';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = String(error.response?.data?.message || error.message || '').toLowerCase();
    const isAuthExpiry =
      status === 401 ||
      message.includes('token has expired') ||
      message.includes('jwt expired') ||
      message.includes('invalid token');

    if (isAuthExpiry && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


// Tours API
export const toursAPI = {
  // Public (for preview)
  getAll: (params) => api.get('/tours', { params }),
  getOne: (slug) => api.get(`/tours/${slug}`),
  
  // Admin-specific
  getById: (id) => api.get(`/tours/admin/${id}`),
  getStats: () => api.get('/tours/admin/stats'),
  create: (data) => api.post('/tours', data),
  update: (id, data) => api.put(`/tours/${id}`, data),
  delete: (id) => api.delete(`/tours/${id}`),
  addItinerary: (id, data) => api.post(`/tours/${id}/itinerary`, data),
  bulkUpdateItinerary: (id, data) => api.put(`/tours/${id}/itinerary/bulk`, data),
  updateAvailability: (id, data) => api.put(`/tours/${id}/availability`, data),
};

// Destinations API
export const destinationsAPI = {
  getAll: (params) => api.get('/destinations', { params }),
  getOne: (id) => api.get(`/destinations/${id}`),
};

export default api;
