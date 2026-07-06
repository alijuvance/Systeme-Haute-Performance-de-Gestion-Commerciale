import api from '@/api/axios';
import { Customer, CustomerFormData } from '../schemas/customerSchema';

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get('/api/customers');
  return response.data;
};

export const getCustomer = async (id: string): Promise<Customer> => {
  const response = await api.get(`/api/customers/${id}`);
  return response.data;
};

export const createCustomer = async (data: CustomerFormData): Promise<Customer> => {
  const response = await api.post('/api/customers', data);
  return response.data;
};

export const updateCustomer = async (id: string, data: CustomerFormData): Promise<Customer> => {
  const response = await api.patch(`/api/customers/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/api/customers/${id}`);
};
