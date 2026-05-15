'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { FiX, FiInfo } from 'react-icons/fi';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('nyle_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const expires = 365; // 1 year
    Cookies.set('nyle_cookie_consent', 'accepted', { expires });
    Cookies.set('nyle_functional_cookies', 'true', { expires });
    Cookies.set('nyle_analytical_cookies', 'true', { expires });
    Cookies.set('nyle_marketing_cookies', 'true', { expires });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const expires = 365;
    Cookies.set('nyle_cookie_consent', 'rejected', { expires });
    Cookies.remove('nyle_functional_cookies');
    Cookies.remove('nyle_analytical_cookies');
    Cookies.remove('nyle_marketing_cookies');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl md:rounded-full p-4 md:py-3 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <FiInfo size={18} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed text-center md:text-left">
                  We use cookies to enhance your luxury travel experience and analyze site traffic. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <Link href="/cookies" className="text-primary-600 font-semibold hover:underline">
                    Manage Preferences
                  </Link>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 md:flex-none px-6 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 md:flex-none px-8 py-2 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="hidden md:flex p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
