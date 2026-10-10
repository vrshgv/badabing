import { z } from 'zod';
import { get } from './client';
import { userResponse } from './schemas';

export function listUsers() {
  return get('/users', z.array(userResponse));
}