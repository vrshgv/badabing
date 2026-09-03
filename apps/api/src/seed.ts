//generated
import dataSource from './data-source';
import { User } from './users/user.entity';
import { Screening } from './screenings/screening.entity';
import { Attendance } from './attendances/attendances.entity';

const hours = (n: number) => n * 60 * 60 * 1000;
const days = (n: number) => hours(24 * n);

async function seed() {
  await dataSource.initialize();

  // Truncate rather than delete so identities and dependents go together.
  await dataSource.query(
    'TRUNCATE TABLE "attendances", "screenings", "users" RESTART IDENTITY CASCADE',
  );

  const users = await dataSource.manager.save(
    [
      { email: 'tony@badabing.test', name: 'Tony' },
      { email: 'carmela@badabing.test', name: 'Carmela' },
      { email: 'lorelai@badabing.test', name: 'Lorelai' },
      { email: 'rory@badabing.test', name: 'Rory' },
      { email: 'omar@badabing.test', name: 'Omar' },
    ].map((u) => dataSource.manager.create(User, u)),
  );
  const [tony, carmela, lorelai, rory, omar] = users;

  const now = Date.now();

  const screenings = await dataSource.manager.save(
    [
      {
        // Full house: capacity 2, so claims spill onto the waitlist.
        title: 'The Sopranos — Pine Barrens',
        description: 'Paulie and Christopher lost in the woods. Interior decorating jokes.',
        capacity: 2,
        location: "Tony's basement",
        year: 2001,
        runtimeMinutes: 51,
        hostId: tony.id,
        startsAt: new Date(now + hours(6)),
        cancelledAt: null,
        posterUrl: 'https://placehold.co/400x600/1c1b18/d8c98a?text=Pine+Barrens',
      },
      {
        // Roomy, partially filled.
        title: 'Gilmore Girls — Pilot',
        description: 'Coffee, fast talking, and a small town that never sleeps.',
        capacity: 8,
        location: "Lorelai's living room",
        year: 2000,
        runtimeMinutes: 44,
        hostId: lorelai.id,
        startsAt: new Date(now + days(2)),
        cancelledAt: null,
        posterUrl: 'https://placehold.co/400x600/2f2a3d/f3e2c7?text=Gilmore+Girls',
      },
      {
        // Exactly at capacity, empty waitlist.
        title: 'The Wire — The Target',
        description: 'Baltimore, a dead witness, and a detail nobody wants to run.',
        capacity: 3,
        location: 'Rooftop, Fell Street',
        year: 2002,
        runtimeMinutes: 63,
        hostId: omar.id,
        startsAt: new Date(now + days(5)),
        cancelledAt: null,
        posterUrl: 'https://placehold.co/400x600/14202b/9fc2d6?text=The+Wire',
      },
      {
        // Wide open, no attendances at all.
        title: 'The Mentalist — Pilot',
        description: 'A consultant with no badge and too much confidence.',
        capacity: 12,
        location: 'Community hall',
        year: 2008,
        runtimeMinutes: 43,
        hostId: carmela.id,
        startsAt: new Date(now + days(9)),
        cancelledAt: null,
        posterUrl: 'https://placehold.co/400x600/23262b/c9d1c8?text=The+Mentalist',
      },
      {
        // Already started — claims must be rejected.
        title: 'The Sopranos — College',
        description: 'A campus visit with a detour. Meadow asks the wrong question.',
        capacity: 4,
        location: 'Maine, somewhere off route 1',
        year: 1999,
        runtimeMinutes: 56,
        hostId: tony.id,
        startsAt: new Date(now - days(3)),
        cancelledAt: null,
        posterUrl: 'https://placehold.co/400x600/1c1b18/d8c98a?text=College',
      },
      {
        // Cancelled — claims must be rejected.
        title: 'The Wire — Middle Ground',
        description: 'Cancelled the morning of. The rooftop was double booked.',
        capacity: 6,
        location: 'Rooftop, Fell Street',
        year: 2004,
        runtimeMinutes: 59,
        hostId: omar.id,
        startsAt: new Date(now + days(4)),
        cancelledAt: new Date(now - hours(2)),
        posterUrl: null,
      },
    ].map((s) => dataSource.manager.create(Screening, s)),
  );
  const [pineBarrens, gilmorePilot, theTarget, , college, middleGround] = screenings;

  const confirmed = (screeningId: string, userId: string) => ({
    screeningId,
    userId,
    status: 'confirmed' as const,
    position: null,
  });
  const waitlisted = (screeningId: string, userId: string, position: number) => ({
    screeningId,
    userId,
    status: 'waitlisted' as const,
    position,
  });

  const attendances = await dataSource.manager.save(
    [
      // Sopranos / Pine Barrens: capacity 2, full, two on the waitlist.
      confirmed(pineBarrens.id, tony.id),
      confirmed(pineBarrens.id, carmela.id),
      waitlisted(pineBarrens.id, lorelai.id, 1),
      waitlisted(pineBarrens.id, omar.id, 2),

      // Gilmore Girls: capacity 8, three confirmed, seats remaining.
      confirmed(gilmorePilot.id, lorelai.id),
      confirmed(gilmorePilot.id, rory.id),
      confirmed(gilmorePilot.id, carmela.id),

      // The Wire / The Target: capacity 3, exactly full, nobody waiting.
      confirmed(theTarget.id, omar.id),
      confirmed(theTarget.id, tony.id),
      confirmed(theTarget.id, rory.id),

      // Past screening keeps its attendees.
      confirmed(college.id, tony.id),
      confirmed(college.id, rory.id),

      // Cancelled screening still has the people who had claimed seats.
      confirmed(middleGround.id, omar.id),
      waitlisted(middleGround.id, lorelai.id, 1),
    ].map((a) => dataSource.manager.create(Attendance, a)),
  );

  console.log(
    `seeded ${users.length} users, ${screenings.length} screenings, ${attendances.length} attendances`,
  );

  await dataSource.destroy();
}

seed().catch(async (err) => {
  console.error(err);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
