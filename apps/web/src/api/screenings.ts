import { get } from '../api/client';
import { page, screeningListItem } from './schemas';

export function listScreenings(params: { viewerId: string | null, cursor?: string, limit?: number }) {
  return get('/screenings', page(screeningListItem), params);
} 