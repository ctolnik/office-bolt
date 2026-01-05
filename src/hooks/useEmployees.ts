import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesService } from '@/services/employeesService';
import type { Employee } from '@/types';
import { toast } from 'sonner';

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: employeesService.getAll,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (employee: Omit<Employee, 'id' | 'created_at'>) => 
      employeesService.create(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Сотрудник добавлен');
    },
    onError: () => {
      toast.error('Ошибка при добавлении сотрудника');
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, employee }: { id: string; employee: Partial<Employee> }) =>
      employeesService.update(id, employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Данные сотрудника обновлены');
    },
    onError: () => {
      toast.error('Ошибка при обновлении данных');
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => employeesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Сотрудник удален');
    },
    onError: () => {
      toast.error('Ошибка при удалении сотрудника');
    },
  });
}
