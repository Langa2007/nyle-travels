'use client';

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hoverable = true,
  padding = 'md',
  border = false,
  shadow = 'md',
  onClick,
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  return (
    <motion.div
      className={`
        bg-white rounded-2xl
        ${paddings[padding]}
        ${shadows[shadow]}
        ${border ? 'border border-gray-200' : ''}
        ${hoverable ? 'hover:shadow-xl transition-shadow duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hoverable ? { y: -2 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}