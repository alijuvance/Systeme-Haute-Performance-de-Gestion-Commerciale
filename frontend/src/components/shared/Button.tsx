import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {

  const baseStyles = `
    inline-flex items-center justify-center font-medium 
    transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
    disabled:opacity-50 disabled:pointer-events-none 
    cursor-pointer select-none
    active:scale-[0.97]
  `;

  const variants = {
    primary:   "bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-zinc-900 rounded-lg shadow-sm",
    secondary: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus-visible:ring-zinc-500/30 rounded-lg",
    outline:   "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 focus-visible:ring-zinc-500/30 rounded-lg shadow-sm",
    danger:    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40 rounded-lg shadow-sm",
    ghost:     "bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 focus-visible:ring-zinc-500/30 rounded-lg",
  };

  const sizes = {
    sm:   "h-7 px-2.5 text-xs gap-1.5",
    md:   "h-8 px-3.5 text-[13px] gap-2",
    lg:   "h-10 px-5 text-sm gap-2",
    icon: "h-8 w-8 px-0",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
