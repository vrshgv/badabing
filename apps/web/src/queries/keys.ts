export const queryKeys = {
  screenings: {
    all: ['screenings'] as const,
    list: (viewerId: string | null) => ['screenings', 'list', viewerId] as const,
    detail: (id: string, viewerId: string | null) => ['screenings', 'detail', id, viewerId] as const
  },
  users: ['users'] as const
}