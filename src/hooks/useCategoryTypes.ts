import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryTypesService } from '@/services/categoryTypesService';
import { toast } from 'sonner';
import type { CreateCategoryType, UpdateCategoryType } from '@/types';

export function useCategoryTypes() {
  return useQuery({
    queryKey: ['categoryTypes'],
    queryFn: () => categoryTypesService.getAll(),
  });
}

export function useCreateCategoryType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryType) => categoryTypesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryTypes'] });
      toast.success('Категория создана');
    },
    onError: () => {
      toast.error('Ошибка при создании категории');
    },
  });
}

export function useUpdateCategoryType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryType }) =>
      categoryTypesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryTypes'] });
      toast.success('Категория обновлена');
    },
    onError: () => {
      toast.error('Ошибка при обновлении категории');
    },
  });
}

export function useDeleteCategoryType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryTypesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoryTypes'] });
      toast.success('Категория удалена');
    },
    onError: () => {
      toast.error('Ошибка при удалении категории');
    },
  });
}
