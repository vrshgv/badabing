import type { UserResponse } from "@badabing/shared";
import { z } from 'zod';

export const userResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string()
}) satisfies z.ZodType<UserResponse>;