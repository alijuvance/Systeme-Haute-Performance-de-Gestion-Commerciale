import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Le nom du produit doit contenir au moins 2 caractères.'),
  reference: z.string().min(2, 'La référence est obligatoire.'),
  categoryId: z.string().optional(),
  defaultPrice: z.number().min(0, 'Le prix ne peut pas être négatif.'),
  minimumStockAlert: z.number().min(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface Product {
  id: string;
  name: string;
  reference: string;
  categoryId?: string;
  defaultPrice: number;
  minimumStockAlert: number;
  createdAt: string;
  updatedAt: string;
}
