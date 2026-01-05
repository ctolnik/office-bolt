import api from './api';
import type { Alert, ApiResponse, PaginatedResponse } from '@/types';

export const alertsService = {
  async getAll(params?: {
    page?: number;
    page_size?: number;
    severity?: string;
    resolved?: boolean;
  }): Promise<PaginatedResponse<Alert>> {
    const response = await api.get<PaginatedResponse<Alert>>('/api/alerts', { params });
    return response.data;
  },

  async getUnresolved(): Promise<Alert[]> {
    const response = await api.get<Alert[]>('/api/alerts/unresolved');
    return response.data;
  },

  async resolve(id: string, resolvedBy: string, notes?: string): Promise<void> {
    await api.put(`/api/alerts/${id}/resolve`, { resolved_by: resolvedBy, notes });
  },
};
