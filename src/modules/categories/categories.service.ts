import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { InsertCategory } from '../../../db/schemas/schema';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { PaginatedCategoriesDto } from './dto/paginated-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async findAll(dto: GetCategoriesDto): Promise<PaginatedCategoriesDto> {
    return await this.categoriesRepository.findAll(dto);
  }

  async findOne(id: string): Promise<InsertCategory> {
    return await this.categoriesRepository.findOne(id);
  }

  async create(newCategoryData: InsertCategory): Promise<InsertCategory[]> {
    return await this.categoriesRepository.create(newCategoryData);
  }

  async update(
    id: string,
    newCategoryData: Partial<InsertCategory>,
  ): Promise<InsertCategory[]> {
    return await this.categoriesRepository.update(id, newCategoryData);
  }

  async remove(id: string): Promise<{ message: string }> {
    return await this.categoriesRepository.remove(id);
  }
}
