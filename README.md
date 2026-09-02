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
Query, Zustand. npm workspaces.

## Decisions

Coming as they get made.

🦆