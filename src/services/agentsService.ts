import api from './api';
import type { Agent, AgentConfig, ApiResponse } from '@/types';

export const agentsService = {
  async getAll(): Promise<Agent[]> {
    const response = await api.get<Agent[]>('/api/agents');
    return response.data;
  },

  async getConfig(computerName: string): Promise<AgentConfig> {
    const response = await api.get<AgentConfig>(`/api/agents/${computerName}/config`);
    return response.data;
  },

  async updateConfig(computerName: string, config: AgentConfig): Promise<void> {
    await api.post(`/api/agents/${computerName}/config`, config);
  },

  async delete(computerName: string): Promise<void> {
    await api.delete(`/api/agents/${computerName}`);
  },
};
