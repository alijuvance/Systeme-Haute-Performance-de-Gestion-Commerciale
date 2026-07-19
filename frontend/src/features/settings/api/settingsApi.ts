import api from '@/api/axios';

export interface SystemSettings {
  id: string;
  companyName: string;
  taxId?: string;
  address?: string;
  phone?: string;
  email?: string;
  defaultCurrency: string;
  defaultVatRate: number;
}

export type UpdateSettingsDto = Partial<Omit<SystemSettings, 'id'>>;

export const getSettings = async (): Promise<SystemSettings> => {
  const { data } = await api.get('/api/settings');
  return data;
};

export const updateSettings = async (
  settings: Partial<SystemSettings>
): Promise<SystemSettings> => {
  const { data } = await api.put('/api/settings', settings);
  return data;
};

export const updateSettingsBulk = async (
  settingsArray: { key: string; value: any }[]
): Promise<SystemSettings[]> => {
  const { data } = await api.put('/api/settings/bulk', { settings: settingsArray });
  return data;
};
