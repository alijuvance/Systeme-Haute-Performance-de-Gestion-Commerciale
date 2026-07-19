import React from 'react';

interface ProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export function Progress({ 
  value, 
  size = 'md', 
  variant = 'default', 
  showLabel = false, 
  label,
  className = '',
  animated = false
}: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const barColors = {
    default: 'bg-gray-900',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const trackColors = {
    default: 'bg-gray-100',
    success: 'bg-emerald-50',
    warning: 'bg-amber-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50',
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          {showLabel && <span className="text-xs font-semibold text-gray-900 tabular-nums">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div className={`w-full ${sizeStyles[size]} ${trackColors[variant]} rounded-full overflow-hidden`}>
        <div
          className={`${sizeStyles[size]} ${barColors[variant]} rounded-full transition-all duration-500 ease-out ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
