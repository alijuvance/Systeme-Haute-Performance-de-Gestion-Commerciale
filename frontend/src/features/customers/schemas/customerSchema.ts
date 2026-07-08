import { z } from 'zod';

export const customerSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères.'),
  companyName: z.string().optional(),
  email: z.string().email('Adresse email invalide.').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional(),
  type: z.enum(['B2B', 'B2C']),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export interface Customer {
  id: string;
  fullName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  type: 'B2B' | 'B2C';
  createdAt: string;
  updatedAt: string;
}
