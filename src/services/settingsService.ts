import api from './api';
import type { ApplicationCategory } from '@/types';

export const settingsService = {
  // Get all categories
  async getApplicationCategories(params?: {
    category?: string;
    search?: string;
    active_only?: boolean;
  }) {
    const response = await api.get<{ data: ApplicationCategory[]; total: number }>(
      '/api/categories',
      { params }
    );
    return response.data;
  },

  // Create new category
  async createApplicationCategory(data: Omit<ApplicationCategory, 'id' | 'created_at' | 'updated_at' | 'is_active'>) {
    const response = await api.post<ApplicationCategory>('/api/categories', data);
    return response.data;
  },

  // Update category
  async updateApplicationCategory(id: string, data: Partial<ApplicationCategory>) {
    const response = await api.put<ApplicationCategory>(`/api/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  async deleteApplicationCategory(id: string) {
    await api.delete(`/api/categories/${id}`);
  },

  // Bulk update
  async bulkUpdateCategories(ids: string[], category: string) {
    const response = await api.post('/api/categories/bulk', { ids, category });
    return response.data;
  },

  // Export categories
  async exportCategories(format: 'json' | 'csv') {
    const response = await api.get('/api/categories/export', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Import categories
  async importCategories(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/categories/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
