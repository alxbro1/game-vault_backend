import z from 'zod';

import { paginationDto } from '../../../schemas/pagination.dto';

export const getCategoriesSchema = paginationDto;

export type GetCategoriesDto = z.infer<typeof getCategoriesSchema>;
