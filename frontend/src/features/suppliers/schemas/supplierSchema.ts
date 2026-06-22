import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(2, 'Le nom du fournisseur est obligatoire.'),
  contactName: z.string().optional(),
  phone: z.string().min(8, 'Le numéro de téléphone est trop court.'),
  email: z.string().email('Email invalide.').optional().or(z.literal('')),
  address: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
