'use client';
import React from 'react';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  iconColor?: string; // Tailwind class, e.g., 'text-blue-500'
  iconBg?: string; // Tailwind class, e.g., 'bg-blue-50'
}

interface ActivityFeedProps {
  items: ActivityItem[];
  emptyMessage?: string;
}

export function ActivityFeed({ items, emptyMessage = 'Aucune activité récente' }: ActivityFeedProps) {
  if (items.length === 0) {
    return <div className="text-sm text-gray-500 text-center py-6">{emptyMessage}</div>;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={item.id}>
            <div className="relative pb-8 group">
              {itemIdx !== items.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-100 group-hover:bg-gray-200 transition-colors" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${item.iconBg || 'bg-gray-50'} ${item.iconColor || 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}{' '}
                    </p>
                    {item.description && (
                      <p className="mt-0.5 text-sm text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-gray-500">
                    <time dateTime={item.timestamp}>{item.timestamp}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
