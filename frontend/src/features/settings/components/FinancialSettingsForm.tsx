import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '@/components/providers/ToastProvider';
import { Input } from '@/components/shared/Input';
import { Save } from 'lucide-react';

export const FinancialSettingsForm = () => {
  const { settings, mutateSettings } = useSettings();
  const toast = useToast();
  const [formData, setFormData] = useState({
    defaultCurrency: 'MGA',
    defaultVatRate: 20.0,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        defaultCurrency: settings.defaultCurrency || 'MGA',
        defaultVatRate: settings.defaultVatRate ?? 20.0,
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'defaultVatRate' ? parseFloat(value) || 0 : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await mutateSettings(formData);
      toast.success('Paramètres financiers mis à jour avec succès');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Taxes & Devises</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Devise par défaut</label>
            <select
              name="defaultCurrency"
              value={formData.defaultCurrency}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all text-sm"
            >
              <option value="MGA">Ariary (MGA)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar Américain ($)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Cette devise sera utilisée par défaut pour les factures et les rapports.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taux de TVA par défaut (%)</label>
            <Input 
              name="defaultVatRate" 
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.defaultVatRate} 
              onChange={handleChange} 
              required 
            />
            <p className="mt-1 text-xs text-gray-500">Taux appliqué automatiquement lors de la création d'articles.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
};
