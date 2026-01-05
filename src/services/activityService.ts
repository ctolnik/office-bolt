import api from './api';
import type { DailyActivitySummary, ActivitySegment } from '@/types';

export const activityService = {
  // Get daily activity summary
  async getDailyActivitySummary(computerName: string, date?: string): Promise<DailyActivitySummary> {
    try {
      const response = await api.get('/api/activity/summary', {
        params: {
          computer_name: computerName,
          date: date || new Date().toISOString().split('T')[0],
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('DATABASE_NOT_INITIALIZED');
      }
      throw error;
    }
  },

  // Get activity segments for timeline
  async getActivitySegments(computerName: string, date?: string): Promise<ActivitySegment[]> {
    try {
      const response = await api.get('/api/activity/segments', {
        params: {
          computer_name: computerName,
          date: date || new Date().toISOString().split('T')[0],
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 500) {
        throw new Error('DATABASE_NOT_INITIALIZED');
      }
      throw error;
    }
  },
};
