'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiChevronRight } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import GoogleIdentitySync from '@/components/auth/GoogleIdentitySync';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { login: manualLogin } = useAuth();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await manualLogin(email, password);
      
      if (result.success) {
        // If successful, the hook handles the redirect
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <Link href="/" className="inline-block mb-6">
                <span className="font-serif text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Nyle<span className="text-primary-500">Travel</span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-500">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-gray-900"
                  />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-500/20" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" title="Bird" className="text-primary-600 hover:text-primary-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                className="py-4 rounded-2xl bg-gray-900 hover:bg-black text-white shadow-xl shadow-gray-200"
              >
                Sign In <FiChevronRight className="ml-2" />
              </Button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-sm text-gray-400">Or continue with</span>
            </div>

            <div className="w-full space-y-4">
              <Button
                variant="outline"
                fullWidth
                className="py-4 rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                onClick={() => signIn('google', { callbackUrl })}
              >
                <FaGoogle className="mr-3 text-red-500" /> Sign In with Google
              </Button>

              <div className="w-full flex justify-center">
                <GoogleIdentitySync
                  context="signin"
                  text="signin_with"
                  className="w-full"
                  onSuccess={() => {
                    window.location.href = callbackUrl;
                  }}
                />
              </div>
            </div>

            <p className="mt-10 text-center text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafafa]">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
