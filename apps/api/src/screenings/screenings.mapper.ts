import { Screening } from './screening.entity';
import { ScreeningResponse } from '@badabing/shared';

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