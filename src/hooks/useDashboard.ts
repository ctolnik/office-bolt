import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { REFRESH_INTERVALS } from '@/utils/constants';
import type { DashboardStats, Agent } from '@/types';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    refetchInterval: REFRESH_INTERVALS.dashboard,
  });
}

export function useActiveAgents() {
  return useQuery<Agent[]>({
    queryKey: ['active-agents'],
    queryFn: dashboardService.getActiveAgents,
    refetchInterval: REFRESH_INTERVALS.agents,
  });
}
