# badabing

Movie night screenings with limited seats.

## Structure

npm workspaces monorepo.

```
apps/api          NestJS + TypeORM + Postgres
apps/web          React + Vite + TanStack Query + Zustand
packages/shared   shared TypeScript types
```

Install from the root only. Add deps with `-w @badabing/api`.

## Database

Postgres 16 in Docker. `docker compose up -d`.

TypeORM with `synchronize: false` and `logging: true`. Schema changes go
through generated migrations that are read before running.

Two configs exist on purpose: `app.module.ts` for the running app,
`src/data-source.ts` for the migration CLI.

Migrations run via tsx, not ts-node, because TypeORM 1.1 loads files with
dynamic import. tsx uses esbuild, which drops decorator metadata, so every
`@Column` needs an explicit `type`.

Use `timestamptz` for all timestamps.

## Core problem

A screening has limited seats. Two people claiming the last seat at the same
moment must not both succeed. Seat claims happen in a transaction with a row
lock. Cancelling promotes the first person on the waitlist, also atomically.

One person cannot hold two seats at the same screening. That rule lives in a
unique constraint on the join table, not in application code.

## Domain

**Entities**

- `users` — id, email unique, name
- `screenings` — id, title, starts_at, capacity, host_id, cancelled_at
- `attendances` — screening_id, user_id, status, position, created_at

`attendances` is the join. `status` is `confirmed` or `waitlisted`.
`position` orders the waitlist. Unique constraint on
`(screening_id, user_id)`.

**Scenarios**

1. Host creates a screening with a title, start time and capacity.
2. User claims a seat. If confirmed count is below capacity they become
   confirmed, otherwise waitlisted at the end of the queue.
3. Two users claim the last seat at once. Exactly one gets it, the other is
   waitlisted. Handled with a transaction and a row lock on the screening.
4. Same user claims twice. Rejected by the unique constraint, returns 409.
5. Confirmed user cancels. Their row is removed and the first waitlisted
   user is promoted to confirmed in the same transaction.
6. Waitlisted user cancels. Row removed, positions behind them close up.
   Nobody is promoted.
7. Host cancels the screening. Marked cancelled, no further claims accepted.
8. User claims a seat on a screening that has already started. Rejected.
9. List of upcoming screenings, cursor paginated on `starts_at`, each with
   seats remaining and whether the current user is attending.
10. Screening detail with its confirmed attendees and waitlist in order.

**Rules**

- Capacity applies to confirmed only, waitlist is unbounded
- Cancelled or past screenings accept no claims
- Seats remaining is derived from confirmed count, never stored
- Promotion on cancellation happens server side, never client triggered

## Conventions

- Types shared between api and web go in `packages/shared`
- REST, DTO validation on every endpoint, consistent error shapes
- Cursor pagination on list endpoints, not offset
- Server state in TanStack Query, UI state in Zustand, no overlap

## Notes

Keep these visible rather than optimising them away:

- Query logs stay on, so N+1s surface while working
- Indexes get added in response to measured slow queries, with EXPLAIN ANALYZE recorded
- Connection pool size set explicitly