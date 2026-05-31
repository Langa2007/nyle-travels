'use client';

import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Rate-limit refs — tracked without triggering re-renders
  const logoutAttemptsRef = useRef(0);
  const logoutBlockedUntilRef = useRef(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const response = await authAPI.getMe();
        setUser(response.data.data.user);
      } else {
        setUser(null);
        localStorage.removeItem('user');
        await signOut({ redirect: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, options = {}) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, refreshToken, user } = response.data;

      Cookies.set('token', token, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
      
      setUser(user);
      toast.success('Welcome back!');
      
      router.push(options.redirectTo || '/');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      // Backend now sends verification email instead of tokens
      return { success: true, message: response.data.message };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    // --- Rate limiter: block after 3 failed/repeated attempts ---
    const now = Date.now();
    if (logoutBlockedUntilRef.current && now < logoutBlockedUntilRef.current) {
      const secondsLeft = Math.ceil((logoutBlockedUntilRef.current - now) / 1000);
      toast.error(`Too many sign-out attempts. Please try again in ${secondsLeft}s.`);
      return;
    }

    logoutAttemptsRef.current += 1;

    if (logoutAttemptsRef.current > 3) {
      logoutBlockedUntilRef.current = now + 60 * 1000; // block for 60 seconds
      logoutAttemptsRef.current = 0;
      toast.error('Too many sign-out attempts. Please try again in 60 seconds.');
      return;
    }

    // --- In-flight guard: prevent concurrent calls ---
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await authAPI.logout();
    } catch (error) {
      // Non-fatal: even if backend call fails, we still clear local session
      console.error('Logout API error:', error);
    } finally {
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      localStorage.removeItem('user');
      await signOut({ redirect: false });
      setUser(null);
      setIsLoggingOut(false);
      logoutAttemptsRef.current = 0; // reset counter on success
      logoutBlockedUntilRef.current = null;
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateMe(data);
      setUser(response.data.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updatePassword = async (data) => {
    try {
      await authAPI.updatePassword(data);
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const value = {
    user,
    loading,
    isLoggingOut,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
