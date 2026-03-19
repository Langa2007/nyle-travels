'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  href,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    outlineWhite: 'border-2 border-white text-white hover:bg-white/10 focus:ring-white',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    luxury: 'bg-gradient-to-r from-luxury-gold to-luxury-rose text-white hover:from-luxury-rose hover:to-luxury-gold focus:ring-luxury-gold shadow-luxury',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const content = (
    <>
      {loading ? (
        <>
          <FiLoader className="animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={`${children ? 'mr-2' : ''}`} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={`${children ? 'ml-2' : ''}`} />}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {content}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;