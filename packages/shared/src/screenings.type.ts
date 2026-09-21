
export interface CreateScreeningInput {
  title: string;
  description: string;
  capacity: number;
  location: string;
  hostId: string;
  startsAt: string;
  posterUrl?: string | null;
  year?: number | null;
  runtimeMinutes?: number | null;
}

export interface ScreeningResponse {
  id: string;
  title: string;
  description: string;
  capacity: number;
  posterUrl: string | null;
  location: string;
  year: number | null;
  runtimeMinutes: number | null;
  hostId: string;
  cancelledAt: string | null;
  startsAt: string;
  createdAt: string;
}

export interface Attendee { userId: string; name: string; position: number | null; }

export interface ListScreeningsQuery {
  cursor?: string;
  limit?: number;
  viewerId?: string;
}

export interface ScreeningListItem extends ScreeningResponse {
  seatsRemaining: number;
  isAttending: boolean;
}

export interface ScreeningDetail extends ScreeningListItem {
  confirmed: Attendee[];
  waitlist: Attendee[];
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}