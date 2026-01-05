import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/usersService';

export function useUsers() {
  return useQuery<string[]>({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  });
}
