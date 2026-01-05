import api from './api';

export const usersService = {
  async getAll(): Promise<string[]> {
    const response = await api.get<string[]>('/api/users');
    return response.data;
  },
};
