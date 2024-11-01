import { Injectable } from '@nestjs/common';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(private filesRepository: FilesRepository) {}

  async uploadImage(file: Express.Multer.File) {
    const imageResult = await this.filesRepository.uploadImage(file);

    return {
      public_id: imageResult.public_id,
      secure_url: imageResult.secure_url,
    };
  }

  async removeSingleImage(publicId: string): Promise<Object> {
    return await this.filesRepository.removeSingleImage(publicId);
  }

  async removeMultipleImages(publicsIds: string[]): Promise<Object> {
    return await this.filesRepository.removeMultipleImages(publicsIds);
  }
}
