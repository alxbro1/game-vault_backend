import z from 'zod';
import { selectCategorySchema } from '../../../../db/schemas/categories.schema';
import { paginatedResultSchema } from '../../../schemas/paginated-result.dto';

export const paginatedCategoriesDto =
  paginatedResultSchema(selectCategorySchema);

export type PaginatedCategoriesDto = z.infer<typeof paginatedCategoriesDto>;
