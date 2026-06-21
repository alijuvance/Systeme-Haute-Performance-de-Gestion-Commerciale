import api from '@/api/axios';
import { Product, ProductFormData } from '../schemas/productSchema';

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/api/products');
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const response = await api.post('/api/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: ProductFormData): Promise<Product> => {
  const response = await api.put(`/api/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/api/products/${id}`);
};
