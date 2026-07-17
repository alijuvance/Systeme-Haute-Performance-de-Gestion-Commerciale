import api from '@/api/axios';

export const getFormReferenceData = async () => {
  const [custRes, prodRes, depRes, catRes] = await Promise.all([
    api.get('/api/customers', { params: { limit: 100 } }),
    api.get('/api/products', { params: { limit: 100 } }),
    api.get('/api/depots'),
    api.get('/api/categories'),
  ]);

  // Les endpoints paginés retournent { data, meta }, les autres retournent un tableau
  const extractData = (res: any) => res.data?.data || res.data || [];

  return {
    customers: extractData(custRes),
    products: extractData(prodRes),
    depots: depRes.data || [],
    categories: catRes.data || [],
  };
};
