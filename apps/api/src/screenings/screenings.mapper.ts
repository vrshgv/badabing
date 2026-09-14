import { Screening } from './screening.entity';
import { Attendance } from '../attendances/attendances.entity';
import { ScreeningResponse, ScreeningDetail, Attendee } from '@badabing/shared';

export function toScreeningResponse(s: Screening): ScreeningResponse {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    capacity: s.capacity,
    posterUrl: s.posterUrl,
    location: s.location,
    year: s.year,
    runtimeMinutes: s.runtimeMinutes,
    hostId: s.hostId,
    startsAt: s.startsAt.toISOString(),
    cancelledAt: s.cancelledAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString(),
  };
}

export function toScreeningDetail(screening: Screening, rows: Attendance[]): ScreeningDetail {
  const toAttendee = (a: Attendance): Attendee => ({
    userId: a.userId,
    name: a.user.name,
    position: a.position,
  });

  return {
    ...toScreeningResponse(screening),
    waitlist: rows.filter(r => r.status === 'waitlisted').map(toAttendee),
    confirmed: rows.filter(r => r.status === 'confirmed').map(toAttendee),
    seatsRemaining: Math.max(0, screening.capacity - rows.filter(r => r.status === 'confirmed').length),
  }
} 