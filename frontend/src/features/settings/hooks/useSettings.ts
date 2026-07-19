import { useState, useEffect } from 'react';
import { getSettings, updateSettings, SystemSettings, UpdateSettingsDto } from '../api/settingsApi';

export const useSettings = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getSettings();
      setSettings(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const mutateSettings = async (payload: UpdateSettingsDto) => {
    try {
      const data = await updateSettings(payload);
      setSettings(data);
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erreur lors de la mise à jour des paramètres');
    }
  };

  return {
    settings,
    isLoading,
    error,
    mutateSettings,
    refresh: fetchSettings,
  };
};
