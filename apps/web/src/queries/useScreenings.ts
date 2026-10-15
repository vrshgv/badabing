import { useInfiniteQuery } from "@tanstack/react-query";
import { listScreenings } from "../api/screenings";
import { queryKeys } from "./keys";
import { useCurrentUser } from "./useCurrentUser";

export function useScreenings() {
  const viewerId = useCurrentUser().user?.id ?? null;

  return useInfiniteQuery({
    queryKey: queryKeys.screenings.list(viewerId),
    queryFn: ({ pageParam }) => listScreenings({ cursor: pageParam, viewerId }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: last => last.nextCursor ?? undefined,
    enabled: !useCurrentUser().isPending
  })
}