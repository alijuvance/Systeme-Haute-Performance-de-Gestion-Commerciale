import api from '@/api/axios';
import { Supplier, SupplierFormData } from '../schemas/supplierSchema';

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get('/api/suppliers');
  return response.data;
};

export const createSupplier = async (data: SupplierFormData): Promise<Supplier> => {
  const response = await api.post('/api/suppliers', data);
  return response.data;
};

export const updateSupplier = async (id: string, data: SupplierFormData): Promise<Supplier> => {
  const response = await api.patch(`/api/suppliers/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await api.delete(`/api/suppliers/${id}`);
};
