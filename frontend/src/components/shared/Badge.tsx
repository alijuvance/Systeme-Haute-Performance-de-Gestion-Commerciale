import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
  dot?: boolean;
}

export function Badge({ children, variant = 'default', size = 'sm', className = '', icon, dot }: BadgeProps) {
  const variants = {
    primary: "bg-zinc-900 text-white",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10",
    danger:  "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
    info:    "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10",
    default: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/10",
  };

  const dotColors = {
    primary: "bg-white",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger:  "bg-red-500",
    info:    "bg-blue-500",
    default: "bg-zinc-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`rounded-full font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
