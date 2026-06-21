import api from '@/api/axios';

export const getFormReferenceData = async () => {
  const [custRes, prodRes, depRes] = await Promise.all([
    api.get('/api/customers'),
    api.get('/api/products'),
    api.get('/api/depots'),
  ]);

  return {
    customers: (custRes.data || []).filter((c: any) => c.type === 'B2B'),
    products: prodRes.data || [],
    depots: depRes.data || [],
  };
};
