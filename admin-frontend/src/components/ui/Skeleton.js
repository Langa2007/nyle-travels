export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}) {
  const variants = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer';

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={style}
    />
  );
}