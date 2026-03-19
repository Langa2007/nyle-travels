import { forwardRef } from 'react';

const Checkbox = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-4 h-4 text-primary-600 border-gray-300 rounded
            focus:ring-primary-500 focus:ring-2
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;