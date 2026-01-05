import api from './api';
import type { Employee, ApiResponse } from '@/types';

export const employeesService = {
  async getAll(): Promise<Employee[]> {
    const response = await api.get<Employee[]>('/api/employees');
    return response.data;
  },

  async create(employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> {
    const response = await api.post<Employee>('/api/employees', employee);
    return response.data;
  },

  async update(id: string, employee: Partial<Employee>): Promise<Employee> {
    const response = await api.put<Employee>(`/api/employees/${id}`, employee);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/employees/${id}`);
  },

  async updateConsent(id: string, consentGiven: boolean, consentDate?: string): Promise<void> {
    await api.post(`/api/employees/${id}/consent`, { 
      consent_given: consentGiven,
      consent_date: consentDate 
    });
  },
};
