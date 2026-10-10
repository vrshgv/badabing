import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CurrentUserState = {
  currentUserId: string | null
  setCurrentUserId: (id: string | null) => void
}

export const useCurrentUserStore = create<CurrentUserState>()(
  persist(
    set => ({
      currentUserId: null,
      setCurrentUserId: id => set({ currentUserId: id })
    }),
    { name: 'badabing:currentUser' }
  )
)