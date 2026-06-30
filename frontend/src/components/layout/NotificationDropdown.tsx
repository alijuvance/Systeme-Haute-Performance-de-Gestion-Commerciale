import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, AlertCircle, Info, X, Loader2 } from 'lucide-react';
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

  const unreadCount = notifications.length; // We consider all active notifications as unread since they are dynamic

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
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
        className="text-slate-500 hover:text-slate-900 transition-colors relative p-2 rounded-full hover:bg-slate-100 focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
              {unreadCount} {unreadCount > 1 ? 'alertes' : 'alerte'}
            </span>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-8 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-red-500 text-center">
                Impossible de charger les notifications.
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Aucune notification pour le moment.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  href={notif.link} 
                  key={notif.id}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`flex gap-3 p-3 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 ${getBgColor(notif.type)}`}>
                    <div className="mt-0.5 flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {formatDate(notif.date)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
              <span className="text-xs text-slate-500">
                Ces alertes disparaîtront automatiquement une fois résolues.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
