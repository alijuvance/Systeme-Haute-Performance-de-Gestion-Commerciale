'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  size?: 'sm' | 'md';
  variant?: 'underline' | 'pills';
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, size = 'md', variant = 'underline', className = '' }: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const updateIndicator = useCallback(() => {
    if (variant !== 'underline' || !tabsRef.current) return;
    const activeEl = tabsRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeTab, variant]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const sizeStyles = {
    sm: 'text-xs h-8',
    md: 'text-sm h-9',
  };

  if (variant === 'pills') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              inline-flex items-center gap-1.5 px-3 ${sizeStyles[size]} rounded-md font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`
                ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full tabular-nums
                ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Underline variant
  return (
    <div className={`relative ${className}`}>
      <div ref={tabsRef} className="flex items-center gap-0 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              inline-flex items-center gap-1.5 px-4 ${sizeStyles[size]} font-medium transition-colors duration-200 relative
              ${activeTab === tab.id
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`
                ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-full tabular-nums
                ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}
              `}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Animated underline indicator */}
      <div
        className="absolute bottom-0 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-out"
        style={indicatorStyle}
      />
    </div>
  );
}
