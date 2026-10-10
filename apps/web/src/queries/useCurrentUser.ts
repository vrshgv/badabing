import { useCurrentUserStore } from "../store/currentUser";
import { useUsers } from "./useUsers";

export function useCurrentUser() {
  const currenUserId = useCurrentUserStore(s => s.currentUserId);
  const { data: users, isPending } = useUsers();

  return {
    user: users?.find(u => u.id === currenUserId) ?? null,
    isPending
  }
}