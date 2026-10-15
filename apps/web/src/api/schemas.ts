import type { UserResponse, ScreeningResponse, ScreeningListItem } from "@badabing/shared";
import { z } from 'zod';

export const userResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string()
}) satisfies z.ZodType<UserResponse>;

export const screeningResponse = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  capacity: z.number(),
  posterUrl: z.string().nullable(),
  location: z.string(),
  runtimeMinutes: z.number().nullable(),
  year: z.number().nullable(), 
  hostId: z.string(), 
  cancelledAt: z.string().nullable(), 
  startsAt: z.string(), 
  createdAt: z.string()
}) satisfies z.ZodType<ScreeningResponse>

export const screeningListItem = screeningResponse.extend({
  seatsRemaining: z.number(),
  isAttending: z.boolean()
}) satisfies z.ZodType<ScreeningListItem>

export function page<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    nextCursor: z.string().nullable()
  })
}