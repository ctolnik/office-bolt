import api from './api';
import type { ProcessCatalogEntry } from '@/types';

export const processCatalogService = {
  // Get all process catalog entries
  async getAll(): Promise<ProcessCatalogEntry[]> {
    const response = await api.get('/api/process-catalog');
    return response.data;
  },

  // Create new entry
  async create(data: Omit<ProcessCatalogEntry, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<ProcessCatalogEntry> {
    const response = await api.post('/api/process-catalog', data);
    return response.data;
  },

  // Update entry
  async update(id: string, data: Partial<ProcessCatalogEntry>): Promise<ProcessCatalogEntry> {
    const response = await api.put(`/api/process-catalog/${id}`, data);
    return response.data;
  },

  // Delete entry
  async delete(id: string): Promise<void> {
    await api.delete(`/api/process-catalog/${id}`);
  },
};
