import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsService } from '@/services/alertsService';
import type { Alert, PaginatedResponse } from '@/types';
import { toast } from 'sonner';

export function useAlerts(params?: {
  page?: number;
  page_size?: number;
  severity?: string;
  resolved?: boolean;
}) {
  return useQuery<PaginatedResponse<Alert>>({
    queryKey: ['alerts', params],
    queryFn: () => alertsService.getAll(params),
    refetchInterval: 60000,
  });
}

export function useUnresolvedAlerts() {
  return useQuery<Alert[]>({
    queryKey: ['alerts-unresolved'],
    queryFn: alertsService.getUnresolved,
    refetchInterval: 60000,
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, resolvedBy, notes }: { id: string; resolvedBy: string; notes?: string }) =>
      alertsService.resolve(id, resolvedBy, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts-unresolved'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Алерт разрешен');
    },
    onError: () => {
      toast.error('Ошибка при разрешении алерта');
    },
  });
}
