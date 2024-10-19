import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { InsertProduct } from '../../../db/schemas/schema';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(body: InsertProduct) {
    return await this.productsRepository.createProduct(body);
  }

  async findAll({ page, limit }: { page: number; limit: number }) {
    return await this.productsRepository.findAllProducts({ page, limit });
  }

  async findOne(id: string) {
    return await this.productsRepository.findOneById(id);
  }

  async update(id: string, productData: Partial<InsertProduct>) {
    return await this.productsRepository.updateProduct(id, productData);
  }

  async remove(id: string) {
    return await this.productsRepository.removeProduct(id);
  }

  async findByCategory({
    category,
    page,
    limit,
  }: {
    category: string;
    page: number;
    limit: number;
  }) {
    return await this.productsRepository.findProductsByCategory({
      category,
      page,
      limit,
    });
  }

  async updateProductImage(productId: string, file: Express.Multer.File) {
    return await this.productsRepository.updateProductImage(productId, file);
  }

  async removeProductImage(productId: string, publicId: string) {
    return await this.productsRepository.removeProductImage(
      productId,
      publicId,
    );
  }
}
