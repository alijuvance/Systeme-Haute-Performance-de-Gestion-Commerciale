import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400
              bg-white border rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-300 focus:ring-red-500/10 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
