import api from './api';
import { DailyReport, KeyboardEvent, USBEvent, FileEvent, Screenshot, ApplicationUsage } from '@/types';

export const reportsService = {
  // Get complete daily report for employee
  getDailyReport: async (username: string, date: string): Promise<DailyReport> => {
    const response = await api.get(`/api/reports/daily/${username}`, {
      params: { date }
    });
    return response.data;
  },

  // Get keyboard events for time range
  getKeyboardEvents: async (
    username: string, 
    start: string, 
    end: string
  ): Promise<KeyboardEvent[]> => {
    const response = await api.get(`/api/keyboard/${username}`, {
      params: { start_time: start, end_time: end }
    });
    return response.data;
  },

  // Get USB events for time range
  getUSBEvents: async (
    username: string, 
    start: string, 
    end: string
  ): Promise<USBEvent[]> => {
    const response = await api.get(`/api/usb/${username}`, {
      params: { start_time: start, end_time: end }
    });
    return response.data;
  },

  // Get file events for time range
  getFileEvents: async (
    username: string, 
    start: string, 
    end: string
  ): Promise<FileEvent[]> => {
    const response = await api.get(`/api/files/${username}`, {
      params: { start_time: start, end_time: end }
    });
    return response.data;
  },

  // Get screenshots for time range
  getScreenshots: async (
    username: string, 
    start: string, 
    end: string
  ): Promise<Screenshot[]> => {
    const response = await api.get(`/api/screenshots/${username}`, {
      params: { start_time: start, end_time: end }
    });
    return response.data;
  },

  // Get application usage for time range
  getApplications: async (
    username: string, 
    start: string, 
    end: string
  ): Promise<ApplicationUsage[]> => {
    const response = await api.get(`/api/activity/applications/${username}`, {
      params: { start_time: start, end_time: end }
    });
    return response.data;
  }
};
