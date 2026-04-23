'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiChevronRight } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import GoogleIdentitySync from '@/components/auth/GoogleIdentitySync';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: manualRegister } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleManualRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await manualRegister(formData);

      if (result.success) {
        setIsRegistered(true);
        toast.success('Registration successful! Please check your email.');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
              <FiMail size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              We've sent a verification link to <span className="font-bold text-gray-900">{formData.email}</span>. 
              Please verify your account to access your luxury travel dashboard.
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center space-x-2 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
            >
              <span>Back to Login</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <Link href="/" className="inline-block mb-6">
                <span className="font-serif text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Nyle<span className="text-primary-500">Travel</span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-500">Join Nyle Travel for exclusive luxury experiences</p>
            </div>

            <form onSubmit={handleManualRegister} className="space-y-6" autoComplete="on">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    required
                    autoComplete="given-name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-gray-900"
                  />
                </div>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    required
                    autoComplete="family-name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-gray-900"
                />
              </div>

              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-gray-900"
                  />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                className="py-4 rounded-2xl bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-200"
              >
                Create Account <FiChevronRight className="ml-2" />
              </Button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-sm text-gray-400">Or sign up with</span>
            </div>

            <div className="w-full space-y-4">
              <Button
                variant="outline"
                fullWidth
                className="py-4 rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              >
                <FaGoogle className="mr-3 text-red-500" /> Sign Up with Google
              </Button>

              <div className="w-full">
                <GoogleIdentitySync
                  context="signup"
                  text="signup_with"
                  className="w-full"
                  onSuccess={() => {
                    window.location.href = '/dashboard';
                  }}
                />
              </div>
            </div>

            <p className="mt-10 text-center text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
