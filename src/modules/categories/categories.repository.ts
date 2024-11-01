import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { eq, gte } from 'drizzle-orm';

import { categories, InsertCategory } from '../../../db/schemas/schema';
import { db } from '../../config/db';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { PaginatedCategoriesDto } from './dto/paginated-categories.dto';

@Injectable()
export class CategoriesRepository {
  async findAll({
    cursor,
    limit,
  }: GetCategoriesDto): Promise<PaginatedCategoriesDto> {
    try {
      const limitWithExtra = limit + 1;

      const selectedCategories = await db
        .select()
        .from(categories)
        .where(cursor ? gte(categories.id, cursor) : undefined)
        .limit(limitWithExtra)
        .orderBy(categories.id);

      let nextCursor: string | null = null;

      if (selectedCategories.length === limitWithExtra) {
        nextCursor = selectedCategories[selectedCategories.length - 1].id;
        selectedCategories.pop();
      }

      console.log({ selectedCategories, nextCursor });

      return { data: selectedCategories, nextCursor };
    } catch {
      throw new InternalServerErrorException('Error fetching Categories');
    }
  }

  async findOne(id: string): Promise<InsertCategory> {
    const category = await db.query.categories.findFirst({
      where: (fields) => eq(fields.id, id),
    });

    if (!category)
      throw new NotFoundException(`Category with uuid ${id} didn't exist.`);

    return category;
  }

  async create(newCategoryData: InsertCategory): Promise<InsertCategory[]> {
    const newCategory = await db
      .insert(categories)
      .values(newCategoryData)
      .returning();
    if (!newCategory) throw new BadRequestException('Error Creating Category');

    return newCategory;
  }

  async update(
    id: string,
    newCategoryData: Partial<InsertCategory>,
  ): Promise<InsertCategory[]> {
    const updatedCategory = await db
      .update(categories)
      .set(newCategoryData)
      .where(eq(categories.id, id))
      .returning({ id: categories.id, name: categories.name });

    if (updatedCategory.length == 0)
      throw new NotFoundException(`Category with uuid ${id} didn't exist.`);

    return updatedCategory;
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const rowCount = (
        await db.delete(categories).where(eq(categories.id, id))
      ).rowCount;
      if (rowCount == 0) throw new NotFoundException('Category not Found');
      return { message: 'Category deleted Successfuly.' };
    } catch {
      throw new BadRequestException(
        'Category is already exists in products relations, cannot be deleted',
      );
    }
  }
}
