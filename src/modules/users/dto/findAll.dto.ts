import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { selectProductSchema } from '../../../../db/schemas/products.schema';
import { selectUserSchema } from '../../../../db/schemas/users.schema';

export const findAllSchema = z.object({
  data: z.union([z.array(selectUserSchema), z.array(z.never())]),
  nextCursor: z.string().nullable(),
});

export type FindAllUsersDto = z.infer<typeof findAllSchema>;