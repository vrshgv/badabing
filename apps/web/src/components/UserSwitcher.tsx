import { useUsers } from "../queries/useUsers";
import { useCurrentUserStore } from "../store/currentUser";

export function UserSwitcher() {
  const { data: users, isPending } = useUsers();
  const currentUserId = useCurrentUserStore(s => s.currentUserId);
  const setCurrentUserId = useCurrentUserStore(s => s.setCurrentUserId);
  
  if (isPending) return <p>Loading...</p>
  if (!users?.length) return <p>No users</p>
  
  return (
    <>
      <select 
        value={currentUserId ?? ''}
        onChange={e => setCurrentUserId(e.target.value || null)}
      >
        <option value=""></option>
        {
          users?.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))
        }
      </select>
    </>
  )
}