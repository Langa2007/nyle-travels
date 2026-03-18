'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const Rating = ({
  value = 0,
  count = 0,
  size = 'md',
  interactive = false,
  onChange,
  showCount = true,
  showValue = true,
  precision = 0.5,
  readonly = false,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState(null);
  const [currentValue, setCurrentValue] = useState(value);

  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const starSize = sizes[size] || sizes.md;

  const handleMouseEnter = (index) => {
    if (interactive && !readonly) {
      setHoverValue(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive && !readonly) {
      setHoverValue(null);
    }
  };

  const handleClick = (index) => {
    if (interactive && !readonly) {
      const newValue = precision === 0.5 ? index : Math.ceil(index);
      setCurrentValue(newValue);
      onChange?.(newValue);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : currentValue;

  const renderStar = (index) => {
    const filled = index <= displayValue;
    const halfFilled = precision === 0.5 && index === Math.ceil(displayValue) && displayValue % 1 !== 0;

    return (
      <motion.div
        key={index}
        className={`relative cursor-${interactive ? 'pointer' : 'default'}`}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(index)}
        whileHover={interactive ? { scale: 1.1 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
      >
        <FiStar
          className={`${starSize} transition-colors ${
            filled
              ? 'text-yellow-400 fill-current'
              : halfFilled
              ? 'text-yellow-400 half-filled'
              : 'text-gray-300'
          }`}
        />
        {halfFilled && (
          <FiStar
            className={`absolute top-0 left-0 ${starSize} text-yellow-400 fill-current clip-half`}
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
      </div>
      
      {showValue && (
        <span className="ml-2 font-semibold text-gray-700">
          {currentValue.toFixed(1)}
        </span>
      )}
      
      {showCount && count > 0 && (
        <span className="ml-1 text-sm text-gray-500">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default Rating;

// Add this CSS to your global styles
const style = `
.half-filled {
  position: relative;
}
.half-filled::after {
  content: '★';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  overflow: hidden;
  color: #facc15;
}
`;