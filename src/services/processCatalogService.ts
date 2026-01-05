import api from './api';
import type { ProcessCatalogEntry, CreateProcessCatalogEntry, UpdateProcessCatalogEntry } from '@/types';

interface ApiResponse<T> {
  data: T;
  total?: number;
}

export const processCatalogService = {
  async getAll(): Promise<ProcessCatalogEntry[]> {
    const response = await api.get<ApiResponse<ProcessCatalogEntry[]>>('/api/process-catalog');
    return response.data.data;
  },

  async create(data: CreateProcessCatalogEntry): Promise<ProcessCatalogEntry> {
    const response = await api.post<ApiResponse<ProcessCatalogEntry>>('/api/process-catalog', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateProcessCatalogEntry): Promise<ProcessCatalogEntry> {
    const response = await api.put<ApiResponse<ProcessCatalogEntry>>(`/api/process-catalog/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/process-catalog/${id}`);
  },
};
