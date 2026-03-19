'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tooltip({
  children,
  content,
  placement = 'top',
  delay = 200,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const placements = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`
              absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded
              whitespace-nowrap pointer-events-none
              ${placements[placement]}
            `}
          >
            {content}
            <div
              className={`
                absolute w-2 h-2 bg-gray-900 transform rotate-45
                ${placement === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
                ${placement === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
                ${placement === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
                ${placement === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}