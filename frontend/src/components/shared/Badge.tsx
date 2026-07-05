import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    primary: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-slate-100 text-slate-700 border-slate-200",
    default: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span 
      className={`px-2 py-1 border rounded-none text-xs font-medium inline-flex items-center justify-center ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
