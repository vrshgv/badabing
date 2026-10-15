import { useScreenings } from "../queries/useScreenings";

export function ScreeningsPage() {
  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useScreenings();
  const items = data?.pages.flatMap(p => p.items);
  
  if (isPending) return <p>Loading...</p>
  if (!isPending && !items?.length) return <p>No results</p>
  return (
    <>
      <h1>Screenings page</h1>
      <div>
        {items?.map(i => (
          <div key={i.id}>
            <p>{i.title}</p>
            <p>{i.description}</p>
            <p>{i.startsAt}</p>
            {i.posterUrl && <img src={i.posterUrl} alt={i.title} />}
            <p>{i.location}</p>
            <p>{i.year}</p>
            <p>{i.runtimeMinutes}</p>
            <p>{i.capacity}</p>
            <p>{i.seatsRemaining}</p>
            {i.isAttending && <p>Attending</p>}
          </div>
        ))}
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>Load more</button>
      </div>
    </>
  )
}