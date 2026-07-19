import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction, 
  actionIcon,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      {/* Icon circle */}
      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-6 h-6 text-gray-300" />}
      </div>
      
      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      
      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-sm mb-5">{description}</p>
      )}
      
      {/* CTA */}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} icon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
