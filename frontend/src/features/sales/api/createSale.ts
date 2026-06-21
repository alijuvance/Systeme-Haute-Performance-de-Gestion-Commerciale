import api from '@/api/axios';
import { SaleFormData } from '../schemas/saleSchema';

export interface CreateSalePayload {
  type: 'B2B';
  customerId: string;
  depotId: string;
  amountPaid: number;
  lines: { productId: string; quantity: number; unitPrice: number }[];
}

export const createSale = async (data: SaleFormData): Promise<any> => {
  const payload: CreateSalePayload = {
    type: 'B2B',
    customerId: data.customerId,
    depotId: data.depotId,
    amountPaid: data.amountPaid,
    lines: data.lines,
  };
  const response = await api.post('/api/sales', payload);
  return response.data;
};
