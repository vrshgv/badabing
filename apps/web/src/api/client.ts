import { ErrorCode, type ApiError } from '@badabing/shared';
import type { z } from 'zod';

const BASE = '/api';

export class ApiErrorException extends Error implements ApiError {
  statusCode: ApiError['statusCode'];
  code: ApiError['code'];
  details?: ApiError['details'];

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiErrorException';
    this.statusCode = error.statusCode;
    this.code = error.code;
    this.details = error.details;
  }
}

export function isApiError(e: unknown): e is ApiErrorException {
  return e instanceof ApiErrorException;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    return await res.json();
  } catch {
    return {
      statusCode: res.status,
      code: ErrorCode.UNKNOWN_ERROR,
      message: res.statusText || 'Request failed',
    };
  }
}

async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers
    }
  })

  if (!res.ok) throw new ApiErrorException(await parseError(res));

  return schema.parse(await res.json());
}

async function requestNoContent(path: string, init?: RequestInit): Promise<void> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) throw new ApiErrorException(await parseError(res));
}

export function get<T>(path: string, schema: z.ZodType<T>) {
  return request(path, schema)
}

export function post<T>(path: string, schema: z.ZodType<T>, body: unknown) {
  return request(path, schema, { method: 'POST', body: JSON.stringify(body) })
}

export function del(path: string) {
  return requestNoContent(path, { method: 'DELETE' })
}