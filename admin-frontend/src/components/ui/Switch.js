'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
}) {
  const [isChecked, setIsChecked] = useState(checked);

  const sizes = {
    sm: {
      container: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      container: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      container: 'w-14 h-7',
      circle: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          ${sizes[size].container}
          relative inline-flex items-center rounded-full
          transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${isChecked ? 'bg-primary-600' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <motion.span
          layout
          className={`
            ${sizes[size].circle}
            inline-block transform rounded-full bg-white shadow-lg
            transition-transform
          `}
          animate={{
            x: isChecked ? parseInt(sizes[size].translate) : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {label && (
        <span className="text-sm text-gray-700">{label}</span>
      )}
    </div>
  );
}