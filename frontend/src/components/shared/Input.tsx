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
          <label htmlFor={inputId} className="block text-[13px] font-medium text-zinc-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-3 py-[7px] text-[13px] text-zinc-900 placeholder-zinc-400
              bg-white border rounded-lg
              transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]
              focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/8
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-50
              ${icon ? 'pl-9' : ''}
              ${error
                ? 'border-red-300 focus:ring-red-500/10 focus:border-red-400'
                : 'border-zinc-200 hover:border-zinc-300'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
