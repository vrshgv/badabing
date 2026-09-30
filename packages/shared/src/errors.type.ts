export const ErrorCode = {
  VALIDATION_FAILED:           'VALIDATION_FAILED',
  INVALID_CURSOR:              'INVALID_CURSOR',
  HOST_NOT_FOUND:              'HOST_NOT_FOUND',
  USER_NOT_FOUND:              'USER_NOT_FOUND',
  SCREENING_NOT_FOUND:         'SCREENING_NOT_FOUND',
  ATTENDANCE_NOT_FOUND:        'ATTENDANCE_NOT_FOUND',
  NOT_HOST:                    'NOT_HOST',
  SCREENING_CANCELLED:         'SCREENING_CANCELLED',
  SCREENING_STARTED:           'SCREENING_STARTED',
  SEAT_ALREADY_CLAIMED:        'SEAT_ALREADY_CLAIMED',
  INTERNAL_ERROR:              'INTERNAL_ERROR',
  UNKNOWN_ERROR:               'UNKNOWN_ERROR'
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export interface ApiError {
  statusCode: number;
  code: ErrorCode;
  message: string;
  details?: Record<string, string[]>;
}