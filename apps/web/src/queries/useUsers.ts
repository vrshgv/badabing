import { useQuery } from '@tanstack/react-query';
import { listUsers } from '../api/user';
import { queryKeys } from './keys';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: listUsers
  })
}