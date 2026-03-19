import { forwardRef } from 'react';

const Radio = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex items-center">
      <input
        ref={ref}
        type="radio"
        className={`
          w-4 h-4 text-primary-600 border-gray-300
          focus:ring-primary-500 focus:ring-2
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {label && (
        <label className="ml-3 text-sm text-gray-700">
          {label}
        </label>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;