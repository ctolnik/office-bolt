import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { processCatalogService } from '@/services/processCatalogService';
import { toast } from 'sonner';
import type { ProcessCatalogEntry } from '@/types';

export function useProcessCatalog() {
  return useQuery({
    queryKey: ['process-catalog'],
    queryFn: processCatalogService.getAll,
  });
}

export function useCreateProcessCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processCatalogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-catalog'] });
      toast.success('Программа добавлена в справочник');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Ошибка при добавлении');
    },
  });
}

export function useUpdateProcessCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessCatalogEntry> }) =>
      processCatalogService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-catalog'] });
      toast.success('Запись обновлена');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Ошибка при обновлении');
    },
  });
}

export function useDeleteProcessCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processCatalogService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process-catalog'] });
      toast.success('Запись удалена');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Ошибка при удалении');
    },
  });
}
