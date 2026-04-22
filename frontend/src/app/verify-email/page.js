'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { buildApiUrl } from '@/lib/api-base';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(buildApiUrl(`/auth/verify-email/${token}`), {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        toast.success('Account verified! You can now log in.');
        
        // Optional: Auto redirect after 5 seconds
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed. The link may have expired.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="mb-8 flex justify-center">
            {status === 'verifying' && (
              <FiLoader className="w-16 h-16 text-primary-500 animate-spin" />
            )}
            {status === 'success' && (
              <div className="bg-green-50 p-4 rounded-full">
                <FiCheckCircle className="w-16 h-16 text-green-500" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 p-4 rounded-full">
                <FiXCircle className="w-16 h-16 text-red-500" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            {status === 'verifying' ? 'Verifying...' : 
             status === 'success' ? 'Verified!' : 'Verification Failed'}
          </h1>
          
          <p className="text-gray-500 text-lg mb-10">
            {message}
          </p>

          {status !== 'verifying' && (
            <Link 
              href="/login"
              className="inline-flex items-center justify-center space-x-2 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
            >
              <span>{status === 'success' ? 'Go to Login' : 'Back to Login'}</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          )}

          {status === 'success' && (
            <p className="mt-6 text-sm text-gray-400">
              Redirecting you in a few seconds...
            </p>
          )}
        </div>

        <p className="mt-8 text-gray-400 text-sm">
          © {new Date().getFullYear()} Nyle Travel & Tours. Luxury is in the details.
        </p>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#fafafa]">Verifying email...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
