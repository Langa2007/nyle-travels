import Image from 'next/image';
import { FiUser } from 'react-icons/fi';

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
}) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const getInitials = () => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <div className={`relative ${sizes[size]} ${shapes[shape]} overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt || name || 'Avatar'}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  if (name) {
    return (
      <div
        className={`
          ${sizes[size]} ${shapes[shape]}
          bg-gradient-to-r from-primary-500 to-secondary-500
          flex items-center justify-center text-white font-medium
          ${className}
        `}
      >
        {getInitials()}
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizes[size]} ${shapes[shape]}
        bg-gray-200 flex items-center justify-center text-gray-500
        ${className}
      `}
    >
      <FiUser className="w-1/2 h-1/2" />
    </div>
  );
}