import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from './api-base';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;

        Cookies.set('token', token);
        Cookies.set('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.patch('/auth/update-me', data),
  updatePassword: (data) => api.patch('/auth/update-password', data),
};

// Hotels API
export const hotelsAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  getOne: (slug) => api.get(`/hotels/${slug}`),
  getFeatured: () => api.get('/hotels/featured'),
  getLuxury: () => api.get('/hotels/luxury'),
  search: (query) => api.get('/hotels/search', { params: { query } }),
  getNearby: (lat, lng, radius) => 
    api.get('/hotels/nearby', { params: { latitude: lat, longitude: lng, radius } }),
  checkAvailability: (hotelId, checkIn, checkOut, roomType) =>
    api.get(`/hotels/${hotelId}/availability`, { params: { check_in: checkIn, check_out: checkOut, room_type: roomType } }),
};

// Tours API
export const toursAPI = {
  // Public
  getAll: (params) => api.get('/tours', { params }),
  getOne: (slug) => api.get(`/tours/${slug}`),
  getFeatured: () => api.get('/tours/featured'),
  
  // Admin
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
  getOne: (slug) => api.get(`/destinations/${slug}`),
  getPopular: () => api.get('/destinations/popular'),
  getFeatured: () => api.get('/destinations/featured'),
  search: (query) => api.get('/destinations/search', { params: { query } }),
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings', { params }),
  getOne: (id) => api.get(`/bookings/${id}`),
  getByNumber: (number) => api.get(`/bookings/number/${number}`),
  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
  getUpcoming: (days) => api.get('/bookings/upcoming', { params: { days } }),
  getStats: () => api.get('/bookings/stats'),
};

// Payments API
export const paymentsAPI = {
  createIntent: (data) => api.post('/payments/create-intent', data),
  confirm: (data) => api.post('/payments/confirm', data),
  getMethods: () => api.get('/payments/methods'),
  addMethod: (data) => api.post('/payments/methods', data),
  removeMethod: (methodId) => api.delete(`/payments/methods/${methodId}`),
  setDefaultMethod: (methodId) => api.put(`/payments/methods/${methodId}/default`),
  getHistory: (params) => api.get('/payments/history', { params }),
  getOne: (id) => api.get(`/payments/${id}`),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  retry: (paymentId) => api.post(`/payments/${paymentId}/retry`),
};

// Reviews API
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getHotelReviews: (hotelId, params) => api.get(`/reviews/hotel/${hotelId}`, { params }),
  getOne: (id) => api.get(`/reviews/${id}`),
  update: (id, data) => api.patch(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  report: (id) => api.post(`/reviews/${id}/report`),
  getMyReviews: () => api.get('/reviews/user/me'),
  getRecent: (limit) => api.get('/reviews/recent', { params: { limit } }),
};

export default api;
