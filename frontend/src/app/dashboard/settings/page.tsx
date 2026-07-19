'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Building2, Receipt, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { GeneralSettingsForm } from '@/features/settings/components/GeneralSettingsForm';
import { FinancialSettingsForm } from '@/features/settings/components/FinancialSettingsForm';
import { useSettings } from '@/features/settings/hooks/useSettings';
import Link from 'next/link';

export default function SettingsPage() {
  const { isLoading, error } = useSettings();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Général', icon: <Building2 className="w-4 h-4" /> },
    { id: 'finance', label: 'Taxes & Devises', icon: <Receipt className="w-4 h-4" /> },
    { id: 'security', label: 'Sécurité & Audit', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Une erreur est survenue lors du chargement des paramètres.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-neutral-50/50">
      <PageHeader 
        title="Paramètres du Système" 
        subtitle="Configurez les préférences globales de l'ERP"
        icon={SettingsIcon}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="mt-6">
            {isLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'general' && <GeneralSettingsForm />}
                {activeTab === 'finance' && <FinancialSettingsForm />}
                {activeTab === 'security' && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Logs d'Audit</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Consultez l'historique complet des actions effectuées par les utilisateurs sur le système.
                    </p>
                    <Link 
                      href="/dashboard/settings/audit"
                      className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-900 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Accéder au journal d'audit
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
