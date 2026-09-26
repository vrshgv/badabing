export type AttendanceStatus = 'confirmed' | 'waitlisted';

export interface ClaimSeatInput {
  userId: string;
}

export interface AttendanceResponse {
  id: string;
  screeningId: string;
  userId: string;
  status: AttendanceStatus;
  position: number | null;
  createdAt: string;
}