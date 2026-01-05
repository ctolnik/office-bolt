import api from './api';
import type { DashboardStats, Agent, ApiResponse } from '@/types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },

  async getActiveAgents(): Promise<Agent[]> {
    const response = await api.get<Agent[]>('/api/dashboard/active-now');
    return response.data;
  },
};
