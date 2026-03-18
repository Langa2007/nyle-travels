'use client';

import { Toaster } from 'react-hot-toast';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: '!bg-white !text-gray-900 !rounded-xl !shadow-2xl',
        style: {
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          icon: <FiCheckCircle className="w-5 h-5 text-green-500" />,
          className: '!border-l-4 !border-green-500',
        },
        error: {
          icon: <FiAlertCircle className="w-5 h-5 text-red-500" />,
          className: '!border-l-4 !border-red-500',
        },
        info: {
          icon: <FiInfo className="w-5 h-5 text-blue-500" />,
          className: '!border-l-4 !border-blue-500',
        },
        warning: {
          icon: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />,
          className: '!border-l-4 !border-yellow-500',
        },
      }}
    />
  );
}