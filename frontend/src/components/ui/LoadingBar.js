'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let timeoutId;

    const startLoading = () => {
      setLoading(true);
    };

    const stopLoading = () => {
      timeoutId = setTimeout(() => {
        setLoading(false);
      }, 200); // Delay to ensure smooth transition
    };

    startLoading();
    stopLoading();

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 origin-left"
          style={{ transformOrigin: 'left' }}
        >
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}