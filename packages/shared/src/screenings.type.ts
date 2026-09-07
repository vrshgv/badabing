
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