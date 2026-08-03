import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, actions, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-[13px] text-zinc-500 mt-0.5">{description}</p>
        )}
      </div>
      {(actions || children) && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
