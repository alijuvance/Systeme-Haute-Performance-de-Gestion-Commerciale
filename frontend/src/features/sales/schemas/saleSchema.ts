import { z } from 'zod';

const saleLineSchema = z.object({
  productId: z.string().min(1, 'Veuillez sélectionner un produit.'),
  quantity: z.number().min(1, 'La quantité doit être au moins 1.'),
  unitPrice: z.number().min(0, 'Le prix unitaire ne peut pas être négatif.'),
});

export const saleSchema = z.object({
  customerId: z.string().min(1, 'Veuillez sélectionner un client.'),
  depotId: z.string().min(1, 'Veuillez sélectionner un dépôt.'),
  amountPaid: z.number().min(0, 'L\'acompte ne peut pas être négatif.'),
  lines: z.array(saleLineSchema).min(1, 'Au moins une ligne de produit est requise.'),
}).refine(
  (data) => {
    const total = data.lines.reduce((acc, l) => acc + l.quantity * l.unitPrice, 0);
    return data.amountPaid <= total;
  },
  {
    message: 'L\'acompte ne peut pas dépasser le montant total de la facture.',
    path: ['amountPaid'],
  }
);

export type SaleFormData = z.infer<typeof saleSchema>;
export type SaleLineData = z.infer<typeof saleLineSchema>;
