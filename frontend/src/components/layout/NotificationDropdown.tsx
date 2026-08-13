import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { useNotifications, AppNotification } from '../../features/notifications/hooks/useNotifications';
import { formatDate } from '@/utils/formatters';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, isLoading, error } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBgColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'ERROR': return 'bg-red-50/50 hover:bg-red-50';
      case 'WARNING': return 'bg-amber-50/50 hover:bg-amber-50';
      default: return 'bg-blue-50/50 hover:bg-blue-50';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200/60 rounded-xl shadow-[var(--shadow-xl)] z-50 overflow-hidden flex flex-col max-h-[80vh] animate-scale-in">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-100">
            <h3 className="text-[13px] font-semibold text-zinc-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-semibold bg-zinc-900 text-white px-2 py-0.5 rounded-full tabular-nums">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-2 space-y-1 scrollbar-hide">
            {isLoading ? (
              <div className="flex justify-center items-center py-8 text-zinc-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4 text-[13px] text-red-500 text-center">
                Impossible de charger les notifications.
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 mx-auto mb-2.5 bg-zinc-50 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-zinc-300" />
                </div>
                <p className="text-[13px] text-zinc-400">Aucune notification pour le moment.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  href={notif.link} 
                  key={notif.id}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`flex gap-3 p-3 rounded-lg transition-all duration-150 cursor-pointer border border-transparent hover:border-zinc-200/60 ${getBgColor(notif.type)}`}>
                    <div className="mt-0.5 flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-zinc-900 truncate">{notif.title}</p>
                      <p className="text-[12px] text-zinc-500 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-zinc-400 mt-1.5 font-medium">
                        {formatDate(notif.date)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-zinc-100 bg-zinc-50/30 text-center">
              <span className="text-[11px] text-zinc-400">
                Ces alertes disparaîtront automatiquement une fois résolues.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
