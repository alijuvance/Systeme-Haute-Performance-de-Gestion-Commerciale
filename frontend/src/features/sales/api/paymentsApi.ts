import api from '@/api/axios';

export interface Payment {
  id: string;
  amount: number;
  method: string;
  reference?: string;
  note?: string;
  invoiceId: string;
  createdAt: string;
}

export interface CreatePaymentData {
  amount: number;
  method: string;
  reference?: string;
  note?: string;
  invoiceId: string;
}

export const getPaymentsByInvoice = async (invoiceId: string): Promise<Payment[]> => {
  const response = await api.get(`/api/payments?invoiceId=${invoiceId}`);
  return response.data;
};

export const createPayment = async (data: CreatePaymentData): Promise<Payment> => {
  const response = await api.post('/api/payments', data);
  return response.data;
};
