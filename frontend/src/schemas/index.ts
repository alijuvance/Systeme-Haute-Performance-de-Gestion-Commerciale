import { z } from 'zod';

// Schéma global pour valider les paramètres de pagination dans l'URL
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

// Schéma global pour valider la structure de réponse standard de notre API
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
});
