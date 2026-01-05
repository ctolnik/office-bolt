import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reportsService';

export const useReports = () => {
  const useDailyReport = (username: string, date: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['dailyReport', username, date],
      queryFn: () => reportsService.getDailyReport(username, date),
      enabled: enabled && !!username && !!date,
    });
  };

  const useKeyboardEvents = (username: string, start: string, end: string) => {
    return useQuery({
      queryKey: ['keyboardEvents', username, start, end],
      queryFn: () => reportsService.getKeyboardEvents(username, start, end),
      enabled: !!username && !!start && !!end,
    });
  };

  const useUSBEvents = (username: string, start: string, end: string) => {
    return useQuery({
      queryKey: ['usbEvents', username, start, end],
      queryFn: () => reportsService.getUSBEvents(username, start, end),
      enabled: !!username && !!start && !!end,
    });
  };

  const useFileEvents = (username: string, start: string, end: string) => {
    return useQuery({
      queryKey: ['fileEvents', username, start, end],
      queryFn: () => reportsService.getFileEvents(username, start, end),
      enabled: !!username && !!start && !!end,
    });
  };

  const useScreenshots = (username: string, start: string, end: string) => {
    return useQuery({
      queryKey: ['screenshots', username, start, end],
      queryFn: () => reportsService.getScreenshots(username, start, end),
      enabled: !!username && !!start && !!end,
    });
  };

  const useApplications = (username: string, start: string, end: string) => {
    return useQuery({
      queryKey: ['applications', username, start, end],
      queryFn: () => reportsService.getApplications(username, start, end),
      enabled: !!username && !!start && !!end,
    });
  };

  return {
    useDailyReport,
    useKeyboardEvents,
    useUSBEvents,
    useFileEvents,
    useScreenshots,
    useApplications,
  };
};
