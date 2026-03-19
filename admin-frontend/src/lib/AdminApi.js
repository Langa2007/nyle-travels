import api from './api';

export const adminAPI = {
  // Dashboard
  getDashboardStats: (timeframe) => 
    api.get('/admin/dashboard/stats', { params: { timeframe } }),
  
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
  
  uploadMedia: (formData, isVideo = false) =>
    api.post(`/admin/settings/${isVideo ? 'video' : 'media'}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default adminAPI;