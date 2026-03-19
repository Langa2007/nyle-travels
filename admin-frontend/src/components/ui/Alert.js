import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiInfo, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiX 
} from 'react-icons/fi';

const icons = {
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  error: FiAlertCircle,
};

const colors = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200',
};

export default function Alert({
  type = 'info',
  title,
  message,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className = '',
}) {
  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          relative p-4 border rounded-xl
          ${colors[type]}
          ${className}
        `}
      >
        <div className="flex items-start">
          {showIcon && Icon && (
            <div className="flex-shrink-0 mr-3">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h3 className="text-sm font-medium mb-1">{title}</h3>
            )}
            {message && (
              <p className="text-sm">{message}</p>
            )}
          </div>
          {dismissible && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 ml-3 hover:opacity-70 transition-opacity"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}