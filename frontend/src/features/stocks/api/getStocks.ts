import api from '@/api/axios';

export const getStocks = async (depotId?: string): Promise<any[]> => {
  const params: any = { limit: 100 };
  if (depotId) params.depotId = depotId;
  const response = await api.get('/api/stock-levels', { params });
  // Le backend retourne maintenant { data, meta }
  const responseData = response.data;
  return responseData.data || responseData;
};

export const getDepots = async (): Promise<any[]> => {
  const response = await api.get('/api/depots');
  return response.data;
};

export const addStockMovement = async (data: {
  type: string;
  productId: string;
  depotId: string;
  quantityChanged: number;
  reference?: string;
}): Promise<any> => {
  const response = await api.post('/api/stock-movements', data);
  return response.data;
};
