'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const useAdmin = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      router.push('/login');
      return;
    }

    const adminRoles = ['admin', 'super_admin'];
    const hasAdminRole = adminRoles.includes(user.role);

    setIsAdmin(hasAdminRole);
    setLoading(false);

    if (!hasAdminRole) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/');
    }
  };

  return {
    isAdmin,
    loading,
    user,
  };
};