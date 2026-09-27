# badabing

Post a movie night, take a seat, join the waitlist when it's full.

The interesting part is what happens when two people claim the last seat at
the same moment.

## Running it

```bash
docker compose up -d
npm install
npm run migration:run -w @badabing/api
npm run start:dev -w @badabing/api
```

## Stack

TypeScript throughout. NestJS, TypeORM, Postgres. React, Vite, TanStack
Query, Zustand, Zod. npm workspaces.

## Decisions

### The last seat

Counting confirmed seats and then inserting a row is two steps, and two
requests can slip between them. Both count, both see room, both insert, and
the screening is oversold by one.

So the claim runs in one transaction that starts by locking the screening
row:

```ts
const screening = await manager.findOne(Screening, {
  where: { id: screeningId },
  lock: { mode: 'pessimistic_write' },   // SELECT ... FOR UPDATE
});
```

Everyone claiming the same screening queues on that row. The second request
counts only after the first has committed, sees the seat gone, and joins the
waitlist. Different screenings never wait on each other.

The screening row is the right thing to lock because it owns `capacity`,
which is the rule being protected. Locking attendance rows wouldn't help —
the row that would break the rule doesn't exist yet.

### Rules that live in the database

One person, one seat per screening. That's a unique constraint on
`(screening_id, user_id)`, not an `if` in the service. An application check
has the same race as the capacity check and would need the same lock to be
correct; Postgres enforces it under any concurrency for free. The service
catches the unique violation and returns a 409.

Seats remaining is derived from the confirmed count on every read, never
stored. A stored counter is a second copy of the truth that has to be kept
in step under concurrency, which is the original problem again.

### The N+1

`GET /screenings` shows seats remaining on every card. The obvious version
asks the database for a count once per screening: one query for the page,
then twenty more. Query logging stays on in development, and twenty
identical `SELECT count(*)` lines in a row are hard to miss.

It's one grouped query over the page's ids instead, folded into a `Map` and
read while mapping. "Am I attending this one?" works the same way — one `IN`
query, one `Set`.

Those counts filter on `screening_id` and `status`, so `attendances` has a
composite index on that pair, in that order: `screening_id` is the selective
one and the one sometimes queried alone.

### Cursor pagination

The list is keyset paginated on `(starts_at, id)`, not `OFFSET`.

`OFFSET` makes the database walk and throw away the rows before your page,
so later pages cost more. And this list moves under the reader — screenings
drop off the front as they start, new ones land in the middle — so offsets
shift and you silently skip or repeat entries while scrolling.

A cursor names a row instead of counting from the start:

```ts
qb.andWhere('(s.startsAt, s.id) > (:startsAt, :id)', { startsAt, id });
```

`id` is the tiebreaker, because two screenings can start at the same minute
and a cursor sitting on that boundary would otherwise lose one. The cursor
itself is base64url — opaque to clients, still readable when debugging.

The page is fetched with `limit + 1`: if the extra row comes back there's a
next page, which beats counting the whole future set to decide whether to
show a "load more".

One catch worth the migration it took: `toISOString()` only goes to
milliseconds, while `timestamptz` stores microseconds. A cursor built from
a trimmed timestamp compares as smaller than the row it came from, and that
row gets served twice. `starts_at` is `timestamptz(3)` so the stored value
and the cursor can't disagree.

🦆
