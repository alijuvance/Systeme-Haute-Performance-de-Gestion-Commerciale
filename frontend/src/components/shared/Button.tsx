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
  
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900/30 rounded-lg shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500/20 rounded-lg",
    outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500/20 rounded-lg shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/30 rounded-lg shadow-sm",
    ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500/20 rounded-lg",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-9 px-4 text-sm gap-2",
    lg: "h-11 px-5 text-sm gap-2",
    icon: "h-9 w-9 px-0",
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
