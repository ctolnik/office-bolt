import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { toast } from 'sonner';

export function useApplicationCategories(filters?: {
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['app-categories', filters],
    queryFn: () => settingsService.getApplicationCategories(filters),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsService.createApplicationCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-categories'] });
      toast.success('Приложение добавлено');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Ошибка при добавлении');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      settingsService.updateApplicationCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-categories'] });
      toast.success('Категория обновлена');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Ошибка при обновлении');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsService.deleteApplicationCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-categories'] });
      toast.success('Приложение удалено');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Ошибка при удалении');
    },
  });
}

export function useBulkUpdateCategories() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ids, category }: { ids: string[]; category: string }) =>
      settingsService.bulkUpdateCategories(ids, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-categories'] });
      toast.success('Категории обновлены');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Ошибка при обновлении');
    },
  });
}
