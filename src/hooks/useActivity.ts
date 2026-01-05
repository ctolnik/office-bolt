import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activityService';

export function useActivitySummary(computerName: string, date?: string) {
  return useQuery({
    queryKey: ['activity-summary', computerName, date],
    queryFn: () => activityService.getDailyActivitySummary(computerName, date),
    enabled: !!computerName,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

export function useActivitySegments(computerName: string, date?: string, enabled = true) {
  return useQuery({
    queryKey: ['activity-segments', computerName, date],
    queryFn: () => activityService.getActivitySegments(computerName, date),
    enabled: !!computerName && enabled,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}
