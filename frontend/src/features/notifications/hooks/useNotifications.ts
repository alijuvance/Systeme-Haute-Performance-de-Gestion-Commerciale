import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { io } from 'socket.io-client';

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

    // Configuration WebSocket pour les notifications en temps réel
    const socketURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const socket = io(socketURL);

    socket.on('connect', () => {
      console.log('Connecté au serveur de notifications WebSocket');
    });

    socket.on('refresh_notifications', () => {
      console.log('Actualisation des notifications via WebSocket');
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { notifications, isLoading, error };
};
