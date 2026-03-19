'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useNotification() {
  const [notifications, setNotifications] = useState([]);

  const showSuccess = useCallback((message) => {
    toast.success(message);
    setNotifications(prev => [...prev, { type: 'success', message, id: Date.now() }]);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message);
    setNotifications(prev => [...prev, { type: 'error', message, id: Date.now() }]);
  }, []);

  const showWarning = useCallback((message) => {
    toast(message, { icon: '⚠️' });
    setNotifications(prev => [...prev, { type: 'warning', message, id: Date.now() }]);
  }, []);

  const showInfo = useCallback((message) => {
    toast(message, { icon: 'ℹ️' });
    setNotifications(prev => [...prev, { type: 'info', message, id: Date.now() }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearNotifications,
  };
}