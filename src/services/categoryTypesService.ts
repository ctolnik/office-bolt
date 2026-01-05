import api from './api';
import type { CategoryType, CreateCategoryType, UpdateCategoryType } from '@/types';

interface ApiResponse<T> {
  data: T;
  total?: number;
}

export const categoryTypesService = {
  async getAll(): Promise<CategoryType[]> {
    const response = await api.get<ApiResponse<CategoryType[]>>('/category-types');
    return response.data.data;
  },

  async getById(id: string): Promise<CategoryType> {
    const response = await api.get<ApiResponse<CategoryType>>(`/category-types/${id}`);
    return response.data.data;
  },

  async create(data: CreateCategoryType): Promise<CategoryType> {
    const response = await api.post<ApiResponse<CategoryType>>('/category-types', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateCategoryType): Promise<CategoryType> {
    const response = await api.put<ApiResponse<CategoryType>>(`/category-types/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/category-types/${id}`);
  },
};
