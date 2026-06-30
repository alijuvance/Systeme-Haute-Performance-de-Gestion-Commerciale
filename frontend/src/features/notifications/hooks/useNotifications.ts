import { useState, useEffect } from 'react';
import api from '@/api/axios';

export interface AppNotification {
  id: string;
  type: 'WARNING' | 'ERROR' | 'INFO';
  title: string;
  message: string;
  link: string;
  date: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/notifications');
        setNotifications(response.data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des notifications.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
    // Rafraîchissement toutes les 2 minutes (optionnel, mais utile)
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  return { notifications, isLoading, error };
};
