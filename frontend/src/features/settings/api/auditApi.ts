import api from '@/api/axios';
import { PaginatedResponse } from '@/types';

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

export const getAuditLogs = async (params: { page?: number; limit?: number; search?: string; entity?: string; action?: string }) => {
  const response = await api.get('/api/audit-logs', { params });
  return response.data as PaginatedResponse<AuditLog>;
};
