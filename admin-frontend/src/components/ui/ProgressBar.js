import { motion } from 'framer-motion';

export default function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'primary',
  animated = true,
  className = '',
}) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  const colors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    info: 'bg-blue-600',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`${colors[color]} rounded-full ${sizes[size]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.5, ease: 'easeOut' } : {}}
        />
      </div>
    </div>
  );
}