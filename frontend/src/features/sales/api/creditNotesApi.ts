import api from '@/api/axios';

export interface CreditNoteLine {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateCreditNoteData {
  invoiceId: string;
  reason?: string;
  lines: CreditNoteLine[];
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  date: string;
  reason?: string;
  totalAmount: number;
  status: string;
  invoiceId: string;
  createdAt: string;
  lines: any[];
}

export const getCreditNotesByInvoice = async (invoiceId: string): Promise<CreditNote[]> => {
  const response = await api.get(`/api/credit-notes/by-invoice?invoiceId=${invoiceId}`);
  return response.data;
};

export const createCreditNote = async (data: CreateCreditNoteData): Promise<CreditNote> => {
  const response = await api.post('/api/credit-notes', data);
  return response.data;
};
