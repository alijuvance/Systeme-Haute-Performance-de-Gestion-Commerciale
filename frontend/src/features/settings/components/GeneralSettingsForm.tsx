import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '@/components/providers/ToastProvider';
import { Input } from '@/components/shared/Input';
import { Save } from 'lucide-react';

export const GeneralSettingsForm = () => {
  const { settings, mutateSettings } = useSettings();
  const toast = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    address: '',
    phone: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || '',
        taxId: settings.taxId || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await mutateSettings(formData);
      toast.success('Paramètres généraux mis à jour avec succès');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Informations de l'entreprise</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
            <Input 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
              required 
              placeholder="Ex: FANJAVA ERP" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'Identification Fiscale (NIF/STAT)</label>
            <Input 
              name="taxId" 
              value={formData.taxId} 
              onChange={handleChange} 
              placeholder="NIF / STAT" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <Input 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+261 34 00 000 00" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
            <Input 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="contact@entreprise.com" 
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse physique</label>
            <Input 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="123 Rue de la République, Ville" 
            />
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
