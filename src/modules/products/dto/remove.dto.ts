import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RemoveOneImageDto {
  @IsNotEmpty()
  @IsString()
  publicId: string;
}

export class RemoveManyImagesDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  IDs: Array<string>;
}
