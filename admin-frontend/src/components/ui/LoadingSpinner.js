export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = '',
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    gray: 'border-gray-600',
  };

  return (
    <div
      className={`
        ${sizes[size]} border-4 border-t-transparent rounded-full animate-spin
        ${colors[color]}
        ${className}
      `}
    />
  );
}