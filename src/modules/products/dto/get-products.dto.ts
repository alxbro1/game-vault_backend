import z from 'zod';

import { paginationDto } from '../../../schemas/pagination.dto';

export const getProductsSchema = z
  .object({
    type: z.enum(['physical', 'digital']).optional(),
    search: z.string().optional(),
  })
  .extend(paginationDto.shape);

export type GetProductsDto = z.infer<typeof getProductsSchema>;
