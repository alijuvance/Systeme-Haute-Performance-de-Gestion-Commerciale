'use client';

import { SaleForm } from '@/features/sales/components/SaleForm';
import { PageHeader } from '@/components/shared/PageHeader';

export default function NewSalePage() {
  return (
    <>
      <PageHeader title="Nouvelle Facture B2B" description="Créez une facture pour un client professionnel." />
      <SaleForm />
    </>
  );
}
