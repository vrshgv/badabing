import { Attendance } from './attendances.entity';
import { AttendanceResponse } from '@badabing/shared';

export function toAttendanceResponse(attendance: Attendance): AttendanceResponse {
  return {
    id: attendance.id,
    screeningId: attendance.screeningId,
    userId: attendance.userId,
    status: attendance.status,
    position: attendance.position,
    createdAt: attendance.createdAt.toISOString(),
  }
}