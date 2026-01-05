import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentsService } from '@/services/agentsService';
import { REFRESH_INTERVALS } from '@/utils/constants';
import type { Agent, AgentConfig } from '@/types';
import { toast } from 'sonner';

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    refetchInterval: REFRESH_INTERVALS.agents,
  });
}

export function useAgentConfig(computerName: string) {
  return useQuery<AgentConfig>({
    queryKey: ['agent-config', computerName],
    queryFn: () => agentsService.getConfig(computerName),
    enabled: !!computerName,
  });
}

export function useUpdateAgentConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ computerName, config }: { computerName: string; config: AgentConfig }) =>
      agentsService.updateConfig(computerName, config),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agent-config', variables.computerName] });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Конфигурация агента обновлена');
    },
    onError: () => {
      toast.error('Ошибка при обновлении конфигурации');
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (computerName: string) => agentsService.delete(computerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Агент удален');
    },
    onError: () => {
      toast.error('Ошибка при удалении агента');
    },
  });
}
