import axios from 'axios';
import api from './api';

export const adminAPI = {
  // Dashboard
  getDashboardStats: (timeframe) => {
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const baseUrl = isDev ? 'http://localhost:3000/api' : 'https://nyle-travels-frontend.vercel.app/api';
    return axios.get(`${baseUrl}/admin/dashboard/stats`, { params: { timeframe } });
  },
  
  getAnalytics: () => 
    api.get('/admin/analytics'),

  // Users
  getUsers: (params) => 
    api.get('/admin/users', { params }),
  
  getUserDetails: (userId) => 
    api.get(`/admin/users/${userId}`),
  
  updateUserRole: (userId, role) => 
    api.patch(`/admin/users/${userId}/role`, { role }),
  
  toggleUserStatus: (userId, action) => 
    api.patch(`/admin/users/${userId}/status`, { action }),

  // Bookings
  getBookings: (params) => 
    api.get('/admin/bookings', { params }),
  
  updateBookingStatus: (bookingId, data) => 
    api.patch(`/admin/bookings/${bookingId}/status`, data),

  // Tours
  createTour: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'gallery_images') {
        data[key].forEach(file => formData.append('gallery_images', file));
      } else if (key === 'featured_image') {
        formData.append('featured_image', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/admin/tours', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  bulkUpdateTours: (data) => 
    api.post('/admin/tours/bulk-update', data),
  
  duplicateTour: (tourId) => 
    api.post(`/admin/tours/${tourId}/duplicate`),

  // Payments
  getPayments: (params) => 
    api.get('/admin/payments', { params }),
  
  processRefund: (paymentId, data) => 
    api.post(`/admin/payments/${paymentId}/refund`, data),

  // Reports
  generateReport: (params) => 
    api.get('/admin/reports/generate', { 
      params,
      responseType: params.format === 'excel' ? 'blob' : 'json'
    }),

  // Settings
  updateSettings: (data) =>
    api.patch('/admin/settings', data),
  
  uploadMedia: (formData, isVideo = false) => {
    // For media uploads, especially large videos, we bypass the Vercel proxy 
    // to avoid the 4.5MB request body limit on Vercel Serverless Functions.
    const directApiUrl = 'https://nyle-travels.onrender.com/api';
    const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    
    const uploadApi = isProduction 
      ? axios.create({ baseURL: directApiUrl }) 
      : api;

    // Add token to direct upload if needed
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = { 'Content-Type': 'multipart/form-data' };
    if (token && isProduction) headers.Authorization = `Bearer ${token}`;

    return uploadApi.post(`/admin/settings/${isVideo ? 'video' : 'media'}`, formData, {
      headers
    });
  },

  getSettings: () =>
    api.get('/settings'),

  restoreDefaults: () =>
    api.post('/admin/settings/seed-defaults'),

  // Newsletter Subscribers
  getSubscribers: (params) =>
    api.get('/newsletter/admin/subscribers', { params }),
  
  deleteSubscriber: (id) =>
    api.delete(`/newsletter/admin/subscribers/${id}`),

  // Contacts / Inquiries
  getContacts: (params) =>
    api.get('/admin/contacts', { params }),
  
  updateContactStatus: (id, status) =>
    api.patch(`/admin/contacts/${id}/status`, { status }),

  // User Reports
  getReports: (params) =>
    api.get('/admin/reports/user', { params }),
  
  updateReportStatus: (id, status) =>
    api.patch(`/admin/reports/user/${id}/status`, { status }),
};

export default adminAPI;